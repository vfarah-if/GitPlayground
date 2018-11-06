using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.v1.Models;
using static Git.Domain.Constants.AccidentStatisticSorting;

namespace Git.Domain.Owin.Api.v1.ApiControllers
{
    public class AccidentStatisticsController : ApiController
    {
        private readonly ITransportForLondonClient transportForLondonClient;
        private readonly IConfiguration configuration;

        public AccidentStatisticsController(
            ITransportForLondonClient transportForLondonClient, 
            IConfiguration configuration)
        {
            this.transportForLondonClient = transportForLondonClient;
            this.configuration = configuration;
        }

        //TODO: Simplify the binding of values
        public async Task<HttpResponseMessage> Get([ModelBinder] AccidentStatisticsCriteria accidentStatisticsCriteria)
        {
            Trace.TraceInformation($"Retrieving Accident Statistics for {accidentStatisticsCriteria.ToString()}");
            try
            {

                var result = await transportForLondonClient.GetAccidentStatistics(
                    accidentStatisticsCriteria.From,
                    accidentStatisticsCriteria.To,
                    CreateSeverity(accidentStatisticsCriteria.Severity),
                    CreateSortOptions(accidentStatisticsCriteria.SortBy),
                    accidentStatisticsCriteria.Page,
                    accidentStatisticsCriteria.PageSize);
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, result);
                response.Headers.CacheControl = new CacheControlHeaderValue()
                {
                    MaxAge = TimeSpan.FromMinutes(configuration.CacheExpirationTimeInMinutes.Minutes)
                };
                return response;
            }
            catch (Exception e)
            {
                Trace.TraceError("Unable to get accident statistics", e);
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, new HttpError(e, true));
            }
        }

        private static SortOptions<AccidentStatistic> CreateSortOptions(string sortBy)
        {
            switch (sortBy)
            {
                case "ByDateAscending":
                    {
                        return ByDateAscending;
                    }
                case "ByLocationAscending":
                    {
                        return ByLocationAscending;
                    }
                case "BySeverityAscending":
                    {
                        return BySeverityAscending;
                    }
                case "ByLocationDescending":
                    {
                        return ByLocationDescending;
                    }
                case "BySeverityDescending":
                    {
                        return BySeverityDescending;
                    }
                default:
                    {
                        return ByDateDescending;
                    }
            }
        }

        private static Severity CreateSeverity(string severity)
        {
            return Enum.TryParse(severity, out Severity result) ? result : Severity.Fatal;
        }
    }
}
