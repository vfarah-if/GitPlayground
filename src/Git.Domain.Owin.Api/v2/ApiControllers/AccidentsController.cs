
using Git.Domain.Models.TFL;
using Git.Owin.Api.Models;
using Swashbuckle.Swagger.Annotations;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Git.Domain;
using Git.Owin.Api.v2.Services;
using WebApi.OutputCache.V2;

namespace Git.Owin.Api.v2.ApiControllers
{
    [RoutePrefix("v2/accidents")]
    public class AccidentsController : ApiController
    {
        protected internal const int OneMinuteInSeconds = 60;
        protected internal const int FiveMinuteTimeSpanInSeconds = 5 * OneMinuteInSeconds;

        private readonly IAccidentsService _accidentStatisticsService;
        private readonly ILogger _logger;

        public AccidentsController(IAccidentsService accidentStatisticsService, ILogger logger)
        {
            _accidentStatisticsService = accidentStatisticsService;
            _logger = logger;
        }

        /// <summary>
        /// Get Accident Statistics by
        /// </summary>
        [Route("")]
        [SwaggerResponseRemoveDefaults]
        [SwaggerResponse(HttpStatusCode.OK, "Paging list of accident statistics", typeof(Paging<AccidentStatistic>))]
        [SwaggerResponse(HttpStatusCode.BadRequest, "Bad Request")]
        [CacheOutput(ClientTimeSpan = FiveMinuteTimeSpanInSeconds, ServerTimeSpan = FiveMinuteTimeSpanInSeconds)]
        public async Task<HttpResponseMessage> GetAccidents([ModelBinder] AccidentStatisticsQuery accidentStatisticsQuery)
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
                    var result = await _accidentStatisticsService.GetAccidents(accidentStatisticsQuery);
                    return Request.CreateResponse(HttpStatusCode.OK, result);
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
