using System.Diagnostics.CodeAnalysis;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.ModelBinding.Binders;
using Git.Domain.Owin.Api.v1.Models;
using Owin;

namespace Git.Domain.Owin.Api.Host
{
    
    [ExcludeFromCodeCoverage]
    public class DefaultOwinConfiguration
    {
        public void Configuration(IAppBuilder appBuilder)
        {
            HttpConfiguration config = new HttpConfiguration();

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "v1/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            appBuilder.UseWebApi(config);
            appBuilder.UseAutofac(config);

            var provider = new SimpleModelBinderProvider(
                typeof(AccidentStatisticsQuery), new AccidentStatisticsQueryModelBinder());
            config.Services.Insert(typeof(ModelBinderProvider), 0, provider);
        }
    }
}
