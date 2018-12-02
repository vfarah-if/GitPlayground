
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.Models;
using Swashbuckle.Swagger.Annotations;
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Git.Domain.Owin.Api.v2.Services;
using WebApi.OutputCache.V2;

namespace Git.Domain.Owin.Api.v2.ApiControllers
{
    [RoutePrefix("v2/accidents")]
    public class AccidentsController : ApiController
    {
        protected internal const int OneMinuteInSeconds = 60;
        protected internal const int FiveMinuteTimeSpanInSeconds = 5 * OneMinuteInSeconds;
        private readonly IAccidentsService _accidentStatisticsService;

        public AccidentsController(IAccidentsService accidentStatisticsService)
        {
            this._accidentStatisticsService = accidentStatisticsService;
        }

        /// <summary>
        /// Get Accident Statistics by
        /// </summary>
        [Route("")]
        [SwaggerResponseRemoveDefaults]
        [SwaggerResponse(HttpStatusCode.OK, "Paged list of accident statistics", typeof(Paged<AccidentStatistic>))]
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
                    Trace.TraceInformation($"Retrieving Accident Statistics for {accidentStatisticsQuery}");
                    var result = await _accidentStatisticsService.GetAccidentsAsync(accidentStatisticsQuery);
                    return Request.CreateResponse(HttpStatusCode.OK, result);
                }
                catch (Exception e)
                {
                    Trace.TraceError("Unable to get accident statistics", e);
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, $"Unable to get Accident Statistics by {accidentStatisticsQuery}", e);
                }
            }

            var httpError = new HttpError(ModelState, true);
            Trace.TraceError($"Model state is not valid", httpError);
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, httpError);
        }
    }
}
