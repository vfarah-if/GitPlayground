using System;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.ModelBinding.Binders;
using Git.Domain.Owin.Api.Host.ModelBinders;
using Git.Domain.Owin.Api.v1.Models;
using Owin;
using Swashbuckle.Application;

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

            ConfigureSwagger(config);
        }

        private static void ConfigureSwagger(HttpConfiguration config)
        {
            SwaggerConfig.Register();
            config.EnableSwagger(
                    c =>
                    {
                        c.SingleApiVersion("v1", "Api Playground for exploring Test Api Concepts");
                        var baseDirectory = AppDomain.CurrentDomain.BaseDirectory;
                        var commentsFileName = Assembly.GetExecutingAssembly().GetName().Name + ".xml";
                        var commentsFile = Path.Combine(baseDirectory, commentsFileName);
                        if (File.Exists(commentsFile))
                        {
                            c.IncludeXmlComments(commentsFile);
                        }                        
                    })
                .EnableSwaggerUi();

        }
    }
}
