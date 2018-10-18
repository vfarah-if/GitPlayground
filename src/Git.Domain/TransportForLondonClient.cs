using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Flurl;
using Flurl.Http;
using Git.Domain.Models.TFL;

namespace Git.Domain
{
    public class TransportForLondonClient : ITransportForLondonClient
    {
        private const string AccidentStatsPathSegment = "AccidentStats";
        private readonly string baseUrl = ConfigurationManager.AppSettings["TFLApiBaseUrl"];
        private readonly TimeSpan CacheExpirationTimeInMinutes = TimeSpan.FromMinutes(10);
        private readonly Cache<int, IReadOnlyList<AccidentStatistic>> accidentStatisticsCache;

        public TransportForLondonClient()
        {
            accidentStatisticsCache = new Cache<int, IReadOnlyList<AccidentStatistic>>();
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
            var result = await baseUrl
                .AppendPathSegment(AccidentStatsPathSegment)
                .AppendPathSegment(year.ToString())
                .GetJsonAsync<IEnumerable<AccidentStatistic>>()
                .ConfigureAwait(false);

//#if DEBUG
//            var resultFor2017 = result.ToJson();
//            System.IO.File.WriteAllText("c:\\temp\\test2017.json", resultFor2017);
//#endif
            
            var output = filter != null ? result.Where(filter).ToList() : result.ToList();
            if (sortOptions == null) return output.AsReadOnly();
            if (sortOptions.InReverse)
            {
                SortDataInReverse(sortOptions, output);
            }
            else
            {
                SortData(sortOptions, output);
            }
            return output.AsReadOnly();
        }
      
        public async Task<Paged<AccidentStatistic>> GetAccidentStatistics(
            int year, 
            int page = 1, 
            int pageSize = 100, 
            Func<AccidentStatistic, bool> filter = null,
            SortOptions<AccidentStatistic> sortOptions = null
            )
        {
            var zeroIndexedCurrentPage = page - 1;
            if (zeroIndexedCurrentPage < 0)
            {
                zeroIndexedCurrentPage = 0;
            }

            var result = await GetOrStoreAccidentStatisticsFromCache(year, filter, sortOptions);

            long total = result.LongCount();
            double pageCount = total / pageSize;
            var maxPageCount = Convert.ToInt32(Math.Round(pageCount, MidpointRounding.AwayFromZero));
            if (zeroIndexedCurrentPage > maxPageCount)
            {
                zeroIndexedCurrentPage = maxPageCount;
            }

            var skip = zeroIndexedCurrentPage * pageSize;
            var data = result.Skip(skip).Take(pageSize);

            return Paged<AccidentStatistic>.Create(total, data, zeroIndexedCurrentPage + 1, pageSize);
        }

        private async Task<IReadOnlyList<AccidentStatistic>> GetOrStoreAccidentStatisticsFromCache(
            int year,
            Func<AccidentStatistic, bool> filter, 
            SortOptions<AccidentStatistic> sortOptions)
        {
            int cacheKey = year;

            if (filter != null)
            {
                cacheKey += filter.GetHashCode();
            }

            if (sortOptions != null)
            {
                cacheKey += sortOptions.GetHashCode();
            }

            var result = accidentStatisticsCache.Get(cacheKey);
            if (result != null)
            {
                Trace.TraceInformation("Retrieved accident data from cache ...");
                return result;
            }

            Trace.TraceWarning("Retrieving accident data from the server ...");
            result = await GetAllAccidentStatistics(year, filter, sortOptions);

            Trace.TraceInformation($"Storing cache with key '{cacheKey}' ...");
            accidentStatisticsCache.Store(cacheKey, result, CacheExpirationTimeInMinutes);
            return result;
        }

        private static void SortData(SortOptions<AccidentStatistic> sortOptions, List<AccidentStatistic> output)
        {
            Guard(sortOptions);
            output.Sort(sortOptions.Comparer);
        }

        private static void SortDataInReverse(SortOptions<AccidentStatistic> sortOptions, List<AccidentStatistic> output)
        {
            Guard(sortOptions);
            output.Sort((x, y) => sortOptions.Comparer.Compare(y, x));
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
