using System;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.ModelBinding;
using Git.Domain.Owin.Api.v1.Models;
using IModelBinder = System.Web.Http.ModelBinding.IModelBinder;

namespace Git.Domain.Owin.Api.Host
{
    //TODO: Test if a simpler mechanism can not be put in place
    [ModelBinder(typeof(AccidentStatisticsQueryModelBinder))]
    public class AccidentStatisticsQueryModelBinder : IModelBinder
    {
        public bool BindModel(HttpActionContext actionContext, System.Web.Http.ModelBinding.ModelBindingContext bindingContext)
        {
            if (bindingContext.ModelType != typeof(AccidentStatisticsQuery))
            {
                return false;
            }

            var requestUri = actionContext.Request.RequestUri;
            if (requestUri == null)
            {
                return false;
            }
            var queryDictionary = HttpUtility.ParseQueryString(requestUri.Query);
            if (!queryDictionary.HasKeys())
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "from and to are mandatory");
                return false;
            }

            if (queryDictionary["from"] == null)
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "from date is mandatory");
                return false;
            }

            if (queryDictionary["to"] == null)
            {
                bindingContext.ModelState.AddModelError(bindingContext.ModelName, "to date is mandatory");
                return false;
            }

            AccidentStatisticsQuery result = new AccidentStatisticsQuery
            {
                From = DateTime.Parse(queryDictionary["from"]),
                To = DateTime.Parse(queryDictionary["to"]),
                Severity = queryDictionary["severity"] ?? "Fatal",
                SortBy = queryDictionary["sortBy"] ?? "ByDateDescending",
                Page = int.Parse(queryDictionary["page"] ?? "1"),
                PageSize = int.Parse(queryDictionary["pageSize"] ?? "100"),
            };

            bindingContext.Model = result;

            return true;
        }
    }
}