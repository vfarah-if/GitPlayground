using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.Models;
using Git.Domain.Owin.Api.v1.Services;
using Swashbuckle.Swagger.Annotations;
using WebApi.OutputCache.V2;

namespace Git.Domain.Owin.Api.v1.ApiControllers
{
    [RoutePrefix("v1/accidentstatistics")]
    public class AccidentStatisticsController : ApiController
    {
        protected internal const int OneMinuteInSeconds = 60;
        protected internal const int FiveMinuteTimeSpanInSeconds = 5 * OneMinuteInSeconds;
        private readonly IAccidentStatisticsService _accidentStatisticsService;
        private readonly ILogger _logger;

        public AccidentStatisticsController(IAccidentStatisticsService accidentStatisticsService, ILogger logger)
        {
            _accidentStatisticsService = accidentStatisticsService;
            _logger = logger;
        }

        /// <summary>
        /// Get Accident Statistics by
        /// </summary>
        /// <example>http://localhost:9000/v1/accidentstatistics?from=01/01/2014&page=11</example>
        /// <param name="accidentStatisticsQuery.from">Start Date and if left null will default to the start of last year</param>
        /// <param name="accidentStatisticsQuery.to">End Date and if left null will default to the end of last year</param>
        /// <param name="accidentStatisticsQuery.severity">Serious, Slight or Fatal, and if left null will default to Fatal</param>
        /// <param name="accidentStatisticsQuery.sortBy">Sort by options are : DateAscending, LocationAscending, DateDescending (default if left null) or LocationDescending</param>
        /// <param name="accidentStatisticsQuery.page">Current page</param>
        /// <param name="accidentStatisticsQuery.pageSize">Current page size</param>
        /// <returns>Paging List of Accident Statistics</returns>
        [Route("")]
        [SwaggerResponseRemoveDefaults]
        [SwaggerResponse(HttpStatusCode.OK, "Paging list of accident statistics", typeof(Paging<AccidentStatistic>))]
        [SwaggerResponse(HttpStatusCode.BadRequest, "Bad Request")]
        [CacheOutput(ClientTimeSpan = FiveMinuteTimeSpanInSeconds, ServerTimeSpan = FiveMinuteTimeSpanInSeconds)]
        public async Task<HttpResponseMessage> Get([ModelBinder] AccidentStatisticsQuery accidentStatisticsQuery)
        {
            if (accidentStatisticsQuery == null)
            {
                accidentStatisticsQuery = AccidentStatisticsQuery.CreateDefault();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _logger.Information($"Retrieving Accident Statistics for {accidentStatisticsQuery}");
                    var result = await _accidentStatisticsService.GetAccidentStatistics(accidentStatisticsQuery);
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, result);
                    return response;
                }
                catch (Exception e)
                {
                    _logger.Error("Unable to get accident statistics", e);
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, $"Unable to get Accident Statistics by {accidentStatisticsQuery}", e);
                }
            }

            var httpError = new HttpError(ModelState, true);
            _logger.Error($"Model state is not valid", new Exception($"{httpError.Message} {httpError.MessageDetail} {httpError.ExceptionMessage}"));
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, httpError);
        }
    }
}
