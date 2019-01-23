using Flurl;
using Flurl.Http;
using Git.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using static Git.Domain.ErrorMessages;

namespace Git.Domain
{
    public class TransportForLondonClient : ITransportForLondonClient
    {
        private const string AccidentStatsPathSegment = "AccidentStats";

        private readonly string _baseUrl;
        private readonly int _maximumYear;
        private readonly TimeSpan _cacheExpirationTimeInMinutes;
        private readonly Cache<int, IEnumerable<AccidentStatistic>> _accidentStatisticsCache;
        private readonly ILogger _logger;

        public TransportForLondonClient(IConfiguration configuration, ILogger logger)
        {
            _logger = logger;
            _accidentStatisticsCache = new Cache<int, IEnumerable<AccidentStatistic>>();
            _baseUrl = configuration.TransportForLondonBaseUrl;
            _maximumYear = configuration.MaximumYear;
            _cacheExpirationTimeInMinutes = configuration.CacheExpirationTimeInMinutes;
            _logger.Information($"Base Url is {_baseUrl}");
            _logger.Information($"Cache expiration is {_cacheExpirationTimeInMinutes} minutes");
        }

       public async Task<IReadOnlyList<AccidentStatistic>> GetAllAccidentStatistics(int year,
            Func<AccidentStatistic, bool> filter = null,
            SortOptions<AccidentStatistic> sortOptions = null)
        {
            var result = await GetAccidentStatisticsByYear(year);
            return SortAndFilterAccidentStatistics(filter, sortOptions, result);
        }

        public async Task<Paging<AccidentStatistic>> GetAccidentStatistics(
            int year,
            int page = 1,
            int pageSize = 100,
            Func<AccidentStatistic, bool> filter = null,
            SortOptions<AccidentStatistic> sortOptions = null)
        {
            var result = await GetOrStoreAccidentStatisticsFromCache(year, filter, sortOptions);

            return Paging<AccidentStatistic>.Generate(result, pageSize, page);
        }

        public async Task<Paging<AccidentStatistic>> GetAccidentStatistics(
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

            if (from.Year > _maximumYear || to.Year > _maximumYear)
            {
                var errorMessage = string.Format(DatesFromMaxYearNotSupported, _maximumYear);
                throw new NotSupportedException(errorMessage);
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

            return Paging<AccidentStatistic>.Generate(results, pageSize, page);
        }

        private async Task<IEnumerable<AccidentStatistic>> GetAccidentStatisticsByYear(int year)
        {
            var result = await _baseUrl
                .AppendPathSegment(AccidentStatsPathSegment)
                .AppendPathSegment(year.ToString())
                .GetJsonAsync<IEnumerable<AccidentStatistic>>()
                .ConfigureAwait(false);
            return result;
        }

        private IReadOnlyList<AccidentStatistic> SortAndFilterAccidentStatistics(
            Func<AccidentStatistic, bool> filter,
            SortOptions<AccidentStatistic> sortOptions,
            IEnumerable<AccidentStatistic> data,
            bool ignoreSorting = false)
        {
            _logger.Information(ignoreSorting ? "Filtering data only ..." : "Filtering and sorting data ...");

            var output = filter != null ? data.Where(filter).ToList() : data.ToList();
            if (sortOptions == null) return output.AsReadOnly();
            if (!ignoreSorting)
            {
                Sort(sortOptions, output);
            }
            return output.AsReadOnly();
        }

        private void Sort(SortOptions<AccidentStatistic> sortOptions, List<AccidentStatistic> results)
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
            _logger.Warning($"Swapped the dates as {from} is less than or equal to {to}");
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

            var result = _accidentStatisticsCache.Get(cacheKey);
            if (result != null)
            {
                _logger.Information($"Retrieved accident data from cache by key '{cacheKey}'...");
                return SortAndFilterAccidentStatistics(filter, sortOptions, result, ignoreSorting);
            }

            _logger.Warning($"Retrieving accident data from the server for year {year}...");
            var dataByYear = await GetAccidentStatisticsByYear(year);
            _logger.Information($"Storing cache with key '{cacheKey}'...");
            _accidentStatisticsCache.Store(cacheKey, dataByYear, _cacheExpirationTimeInMinutes);
            //#if DEBUG
            //            var resultForCurrentYear = dataByYear.ToJson();
            //            System.IO.File.WriteAllText($"c:\\temp\\test{year}.json", resultForCurrentYear);
            //#endif

            result = SortAndFilterAccidentStatistics(filter, sortOptions, dataByYear, ignoreSorting);
            return result.ToList().AsReadOnly();
        }

        private void SortData(SortOptions<AccidentStatistic> sortOptions, List<AccidentStatistic> output)
        {
            Guard(sortOptions);
            output.Sort(sortOptions.Comparer);
            _logger.Information("Sorting data");
        }

        private void SortDataInReverse(SortOptions<AccidentStatistic> sortOptions, List<AccidentStatistic> output)
        {
            Guard(sortOptions);
            output.Sort((x, y) => sortOptions.Comparer.Compare(y, x));
            _logger.Information("Sorting data in reverse");
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
