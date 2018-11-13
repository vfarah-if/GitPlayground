using Flurl;
using Flurl.Http;
using Git.Domain.Models.TFL;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

using static Git.Domain.ErrorMessages;

namespace Git.Domain
{
    public class TransportForLondonClient : ITransportForLondonClient
    {
        private const string AccidentStatsPathSegment = "AccidentStats";

        private readonly string baseUrl;
        private readonly TimeSpan CacheExpirationTimeInMinutes;
        private readonly Cache<int, IEnumerable<AccidentStatistic>> accidentStatisticsCache;

        public TransportForLondonClient(IConfiguration configuration)
        {
            accidentStatisticsCache = new Cache<int, IEnumerable<AccidentStatistic>>();
            baseUrl = configuration.TransportForLondonBaseUrl;
            CacheExpirationTimeInMinutes = configuration.CacheExpirationTimeInMinutes;
            Trace.TraceInformation($"Base Url is {baseUrl}");
            Trace.TraceInformation($"Cache expiration is {CacheExpirationTimeInMinutes} minutes");
        }

        public async Task<IList<dynamic>> GetAllAccidentStatisticsAsDynamic(int year)
        {
            var result = await baseUrl
                .AppendPathSegment(AccidentStatsPathSegment)
                .AppendPathSegment(year.ToString())
                .GetJsonListAsync()
                .ConfigureAwait(false);
            return result;
        }

        public async Task<IReadOnlyList<AccidentStatistic>> GetAllAccidentStatistics(int year,
            Func<AccidentStatistic, bool> filter = null,
            SortOptions<AccidentStatistic> sortOptions = null)
        {
            var result = await GetAccidentStatisticsByYear(year);
            return SortAndFilterAccidentStatistics(filter, sortOptions, result);
        }

        public async Task<Paged<AccidentStatistic>> GetAccidentStatistics(
            int year,
            int page = 1,
            int pageSize = 100,
            Func<AccidentStatistic, bool> filter = null,
            SortOptions<AccidentStatistic> sortOptions = null)
        {
            var result = await GetOrStoreAccidentStatisticsFromCache(year, filter, sortOptions);

            return Paged<AccidentStatistic>.Generate(result, pageSize, page);
        }

        public async Task<Paged<AccidentStatistic>> GetAccidentStatistics(
            DateTime from,
            DateTime to,
            Severity severity,
            SortOptions<AccidentStatistic> sortOptions,
            int page = 1,
            int pageSize = 100
           )
        {
            if (from > to)
            {
                Swap(ref from, ref to);
            }

            if (from.Year < 2005)
            {
                throw new NotSupportedException(DatesBelow2005NotSupported);
            }

            if (from.Year >= DateTime.UtcNow.Year || to.Year >= DateTime.UtcNow.Year)
            {
                throw new NotSupportedException(DatesFromCurrentYearNotSupported);
            }

            var years = this.GetYears(from, to).ToList();
            var results = new List<AccidentStatistic>();
            bool FilterSeverityAndDateRange(AccidentStatistic x) => x.Severity == severity && x.Date >= from && x.Date <= to;
            foreach (var year in years)
            {
                var result = await GetOrStoreAccidentStatisticsFromCache(
                    year: year,
                    filter: FilterSeverityAndDateRange,
                    sortOptions: sortOptions,
                    ignoreSorting: true);
                results.AddRange(result);
            }

            Sort(sortOptions, results);

            return Paged<AccidentStatistic>.Generate(results, pageSize, page);
        }

        private async Task<IEnumerable<AccidentStatistic>> GetAccidentStatisticsByYear(int year)
        {
            var result = await baseUrl
                .AppendPathSegment(AccidentStatsPathSegment)
                .AppendPathSegment(year.ToString())
                .GetJsonAsync<IEnumerable<AccidentStatistic>>()
                .ConfigureAwait(false);
            return result;
        }

        private static IReadOnlyList<AccidentStatistic> SortAndFilterAccidentStatistics(
            Func<AccidentStatistic, bool> filter,
            SortOptions<AccidentStatistic> sortOptions,
            IEnumerable<AccidentStatistic> data,
            bool ignoreSorting = false)
        {
            Trace.TraceInformation(ignoreSorting ? "Filtering data only ..." : "Filtering and sorting data ...");

            var output = filter != null ? data.Where(filter).ToList() : data.ToList();
            if (sortOptions == null) return output.AsReadOnly();
            if (!ignoreSorting)
            {
                Sort(sortOptions, output);
            }
            return output.AsReadOnly();
        }

        private static void Sort(SortOptions<AccidentStatistic> sortOptions, List<AccidentStatistic> results)
        {
            if (sortOptions == null || results == null)
            {
                return;
            }

            if (sortOptions.InReverse)
            {
                SortDataInReverse(sortOptions, results);
            }
            else
            {
                SortData(sortOptions, results);
            }
        }

        private void Swap(ref DateTime from, ref DateTime to)
        {
            var tempFrom = from;
            from = to;
            to = tempFrom;
            Trace.TraceWarning($"Swapped the dates as {from} is less than or equal to {to}");
        }

        private IEnumerable<int> GetYears(DateTime from, DateTime to)
        {
            var yearDifference = to.Year - from.Year;
            for (int i = 0; i <= yearDifference; i++)
            {
                yield return from.Year + i;
            }
        }

        private async Task<IReadOnlyList<AccidentStatistic>> GetOrStoreAccidentStatisticsFromCache(
            int year,
            Func<AccidentStatistic, bool> filter,
            SortOptions<AccidentStatistic> sortOptions,
            bool ignoreSorting = false)
        {
            int cacheKey = year;

            var result = accidentStatisticsCache.Get(cacheKey);
            if (result != null)
            {
                Trace.TraceInformation($"Retrieved accident data from cache by key '{cacheKey}'...");
                return SortAndFilterAccidentStatistics(filter, sortOptions, result, ignoreSorting);
            }

            Trace.TraceWarning($"Retrieving accident data from the server for year {year}...");
            var dataByYear = await GetAccidentStatisticsByYear(year);
            Trace.TraceInformation($"Storing cache with key '{cacheKey}'...");
            accidentStatisticsCache.Store(cacheKey, dataByYear, CacheExpirationTimeInMinutes);
            //#if DEBUG
            //            var resultForCurrentYear = dataByYear.ToJson();
            //            System.IO.File.WriteAllText($"c:\\temp\\test{year}.json", resultForCurrentYear);
            //#endif

            result = SortAndFilterAccidentStatistics(filter, sortOptions, dataByYear, ignoreSorting);
            return result.ToList().AsReadOnly();
        }

        private static void SortData(SortOptions<AccidentStatistic> sortOptions, List<AccidentStatistic> output)
        {
            Guard(sortOptions);
            output.Sort(sortOptions.Comparer);
            Trace.TraceInformation("Sorting data");
        }

        private static void SortDataInReverse(SortOptions<AccidentStatistic> sortOptions, List<AccidentStatistic> output)
        {
            Guard(sortOptions);
            output.Sort((x, y) => sortOptions.Comparer.Compare(y, x));
            Trace.TraceInformation("Sorting data in reverse");
        }

        private static void Guard(SortOptions<AccidentStatistic> sortOptions)
        {
            if (sortOptions == null)
            {
                throw new ArgumentNullException(nameof(sortOptions));
            }

            if (sortOptions.Comparer == null)
            {
                throw new ArgumentNullException(nameof(sortOptions.Comparer));
            }
        }
    }
}
