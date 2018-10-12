using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using Flurl;
using Flurl.Http;
using Git.Domain.Models.TFL;

namespace Git.Domain
{
    public class TransportForLondonClient
    {
        private const string AccidentStatsPathSegment = "AccidentStats";
        private readonly string baseUrl = ConfigurationManager.AppSettings["TFLApiBaseUrl"];
        private readonly TimeSpan CacheExpirationTimeInMinutes = TimeSpan.FromMinutes(10);
        private readonly Cache<int, IReadOnlyList<AccidentStatistic>> accidentStatisticsCache;

        public TransportForLondonClient()
        {
            accidentStatisticsCache = new Cache<int, IReadOnlyList<AccidentStatistic>>();
        }

        public async Task<IList<dynamic>> GetAccidentStatisticsAsDynamic(int year)
        {
            var result = await baseUrl
                .AppendPathSegment(AccidentStatsPathSegment)
                .AppendPathSegment(year.ToString())
                .GetJsonListAsync()
                .ConfigureAwait(false);
            return result;
        }

        public async Task<IReadOnlyList<AccidentStatistic>> GetAccidentStatistics(int year)
        {
            var result = await baseUrl
                .AppendPathSegment(AccidentStatsPathSegment)
                .AppendPathSegment(year.ToString())
                .GetJsonAsync<IReadOnlyList<AccidentStatistic>>()
                .ConfigureAwait(false);
            return result;
        }

        public async Task<Paged<AccidentStatistic>> GetPagedAccidentStatistics(int year, int page = 1, int pageSize = 100)
        {
            var zeroIndexedCurrentPage = page - 1;
            if (zeroIndexedCurrentPage < 0)
            {
                zeroIndexedCurrentPage = 0;
            }

            var result = await GetOrStoreAccidentStatisticsFromCache(year);

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

        private async Task<IReadOnlyList<AccidentStatistic>> GetOrStoreAccidentStatisticsFromCache(int year)
        {
            var result = accidentStatisticsCache.Get(year);
            if (result != null) return result;

            result = await GetAccidentStatistics(year);
            accidentStatisticsCache.Store(year, result, CacheExpirationTimeInMinutes);
            return result;
        }
    }
}
