using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;
using Flurl;
using Flurl.Http;
using Git.Domain.Models.TFL;

namespace Git.Domain
{
    public class TransportForLondonClient
    {
        private readonly string baseUrl = ConfigurationManager.AppSettings["TFLApiBaseUrl"];
        private const string AccidentStatsPathSegment = "AccidentStats";

        public TransportForLondonClient()
        {
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
    }
}
