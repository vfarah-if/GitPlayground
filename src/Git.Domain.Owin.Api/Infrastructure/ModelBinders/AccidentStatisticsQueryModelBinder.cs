using Git.Domain.Owin.Api.v1.Models;
using System;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.ModelBinding;
using IModelBinder = System.Web.Http.ModelBinding.IModelBinder;

namespace Git.Domain.Owin.Api.Infrastructure.ModelBinders
{
    [ModelBinder(typeof(AccidentStatisticsQueryModelBinder))]
    public class AccidentStatisticsQueryModelBinder : IModelBinder
    {
        private readonly DateTime _lastYearFirstMonthAndDay = new DateTime(DateTime.Now.Year - 1, 01, 01);
        private readonly DateTime _lastYearLastMonthAndDay = new DateTime(DateTime.Now.Year - 1, 12, 31);

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

            if (queryDictionary["to"] != null && !DateTime.TryParse(queryDictionary["to"], out _))
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, $"'{queryDictionary["to"]}' date is invalid");
                return false;
            }

            var from = queryDictionary["from"] != null ? DateTime.Parse(queryDictionary["from"]) : _lastYearFirstMonthAndDay;
            var to = queryDictionary["to"] != null && DateTime.TryParse(queryDictionary["to"], out _) ? DateTime.Parse(queryDictionary["to"]) : _lastYearLastMonthAndDay;
            var page = queryDictionary["page"] != null ? int.Parse(queryDictionary["page"]) : 1;
            var pageSize = queryDictionary["pageSize"] != null ? int.Parse(queryDictionary["pageSize"]) : 100;
            var severity = queryDictionary["severity"] ?? "Fatal";
            var sortBy = queryDictionary["sortBy"] ?? "DateDescending";
            sortBy = queryDictionary["orderBy"] ?? sortBy;

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