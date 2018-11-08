using Git.Domain.Owin.Api.v1.Models;
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.v1.Services;
using Swashbuckle.Swagger.Annotations;

namespace Git.Domain.Owin.Api.v1.ApiControllers
{
    public class AccidentStatisticsController : ApiController
    {
        private readonly IAccidentStatisticsService _accidentStatisticsService;

        public AccidentStatisticsController(IAccidentStatisticsService accidentStatisticsService)
        {
            _accidentStatisticsService = accidentStatisticsService;
        }

        /// <summary>
        /// Get Accident Statistics by
        /// </summary>
        /// <param name="accidentStatisticsQuery.from">Start Date and if left null will default to the start of last year</param>
        /// <param name="accidentStatisticsQuery.to">End Date and if left null will default to the end of last year</param>
        /// <param name="accidentStatisticsQuery.severity">Serious, Slight or Fatal, and if left null will default to Fatal</param>
        /// <param name="accidentStatisticsQuery.sortBy">Sort by options are : ByDateAscending, ByLocationAscending, ByDateDescending (default if left null) or ByLocationDescending</param>
        /// <param name="accidentStatisticsQuery.page">Current page</param>
        /// <param name="accidentStatisticsQuery.pageSize">Current page size</param>
        /// <returns>Paged List of Accident Statistics</returns>
        [SwaggerResponseRemoveDefaults]
        [SwaggerResponse(HttpStatusCode.OK, "Paged list of accident statistics", typeof(Paged<AccidentStatistic>))]
        [SwaggerResponse(HttpStatusCode.BadRequest, "Bad Request")]
        public async Task<HttpResponseMessage> Get([ModelBinder] AccidentStatisticsQuery accidentStatisticsQuery)
        {
            if (accidentStatisticsQuery == null)
            {
                throw new ArgumentNullException(nameof(accidentStatisticsQuery));
            }

            if (ModelState.IsValid)
            {
                try
                {
                    Trace.TraceInformation($"Retrieving Accident Statistics for {accidentStatisticsQuery}");
                    var result = await _accidentStatisticsService.GetAccidentStatistics(accidentStatisticsQuery);
                    HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, result);
                    return response;
                }
                catch (Exception e)
                {
                    //TODO: Create a middleware that deals with errors in a generic way
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
