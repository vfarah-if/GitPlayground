using Git.Owin.Api.Models;
using System;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.ModelBinding;
using Git.Domain;
using IModelBinder = System.Web.Http.ModelBinding.IModelBinder;

namespace Git.Owin.Api.Infrastructure.ModelBinders
{
    [ModelBinder(typeof(AccidentStatisticsQueryModelBinder))]
    public class AccidentStatisticsQueryModelBinder : IModelBinder
    {
        private readonly IConfiguration _configuration;
        private readonly DateTime _maxYearFirstMonthAndDay;
        private readonly DateTime _maxYearLastMonthAndDay;

        public AccidentStatisticsQueryModelBinder(IConfiguration configuration)
        {
            _configuration = configuration;
            _maxYearFirstMonthAndDay = new DateTime(_configuration.MaximumYear, 01, 01);
            _maxYearLastMonthAndDay = new DateTime(_configuration.MaximumYear, 12, 31);
        }

        public bool BindModel(HttpActionContext actionContext, ModelBindingContext bindingContext)
        {
            if (bindingContext.ModelType != typeof(AccidentStatisticsQuery))
            {
                return false;
            }

            var requestUri = actionContext.Request.RequestUri;
            if (requestUri == null)
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Request Uri is required");
                return false;
            }

            var queryDictionary = HttpUtility.ParseQueryString(requestUri.Query);

            if (queryDictionary["from"] != null && !DateTime.TryParse(queryDictionary["from"], out _))
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, $"'{queryDictionary["from"]}' date is invalid");
                return false;
            }

            if (queryDictionary["accidentStatisticsQuery.from"] != null && !DateTime.TryParse(queryDictionary["accidentStatisticsQuery.from"], out _))
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, $"'{queryDictionary["accidentStatisticsQuery.from"]}' date is invalid");
                return false;
            }

            if (queryDictionary["to"] != null && !DateTime.TryParse(queryDictionary["to"], out _))
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, $"'{queryDictionary["to"]}' date is invalid");
                return false;
            }

            if (queryDictionary["accidentStatisticsQuery.to"] != null && !DateTime.TryParse(queryDictionary["accidentStatisticsQuery.to"], out _))
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, $"'{queryDictionary["accidentStatisticsQuery.to"]}' date is invalid");
                return false;
            }

            var from = queryDictionary["from"] != null
                ? DateTime.Parse(queryDictionary["from"]) 
                : (queryDictionary["accidentStatisticsQuery.from"] != null
                    ? DateTime.Parse(queryDictionary["accidentStatisticsQuery.from"]) 
                    : _maxYearFirstMonthAndDay);
            var to = queryDictionary["to"] != null && DateTime.TryParse(queryDictionary["to"], out _) 
                ? DateTime.Parse(queryDictionary["to"]) 
                : (queryDictionary["accidentStatisticsQuery.to"] != null && DateTime.TryParse(queryDictionary["accidentStatisticsQuery.to"], out _)
                    ? DateTime.Parse(queryDictionary["accidentStatisticsQuery.to"])
                    : _maxYearLastMonthAndDay);
            var page = queryDictionary["page"] != null 
                ? int.Parse(queryDictionary["page"]) 
                : (queryDictionary["accidentStatisticsQuery.page"] != null
                    ? int.Parse(queryDictionary["accidentStatisticsQuery.page"])
                    : 1);
            var pageSize = queryDictionary["pageSize"] != null 
                ? int.Parse(queryDictionary["pageSize"]) 
                : (queryDictionary["accidentStatisticsQuery.pageSize"] != null
                    ? int.Parse(queryDictionary["accidentStatisticsQuery.pageSize"])
                    : 100);
            var severity = queryDictionary["severity"] ?? queryDictionary["accidentStatisticsQuery.severity"] ?? "Fatal";
            var sortBy = queryDictionary["sortBy"] ?? queryDictionary["orderBy"] ?? queryDictionary["accidentStatisticsQuery.sortBy"] ?? "DateDescending";

            var result = new AccidentStatisticsQuery
            {
                From = from,
                To = to,
                Severity = severity,
                SortBy = sortBy,
                Page = page,
                PageSize = pageSize,
            };

            bindingContext.Model = result;

            return true;
        }
    }
}