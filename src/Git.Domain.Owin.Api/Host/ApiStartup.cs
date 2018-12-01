using System;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.ModelBinding;
using System.Web.Http.ModelBinding.Binders;
using Git.Domain.Owin.Api.Host;
using Git.Domain.Owin.Api.Infrastructure.ModelBinders;
using Git.Domain.Owin.Api.Infrastructure.Configuration;
using Git.Domain.Owin.Api.Models;
using Microsoft.Owin;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using Owin;
using Swashbuckle.Application;
using System.Net.Http.Formatting;

[assembly: OwinStartup(typeof(ApiStartup))]

namespace Git.Domain.Owin.Api.Host
{
    [ExcludeFromCodeCoverage]
    public class ApiStartup
    {
        public void Configuration(IAppBuilder appBuilder)
        {
            HttpConfiguration config = new HttpConfiguration();

            ConfigureAttributeRouting(config);

            // TODO : Remove if you want the name of the controller to be used instead of attributes
            // ConfigureConventionBasedRouting(config);

            appBuilder.UseWebApi(config);
            appBuilder.UseAutofac(config);

            var provider = new SimpleModelBinderProvider(
                typeof(AccidentStatisticsQuery), new AccidentStatisticsQueryModelBinder());
            config.Services.Insert(typeof(ModelBinderProvider), 0, provider);

            ConfigureSwagger(config);
            UseCorsMiddleware(config);

            ConfigureJsonAsCamelCase(config);
        }

        private static void ConfigureJsonAsCamelCase(HttpConfiguration config)
        {            
            var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();         
            jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }

        private void UseCorsMiddleware(HttpConfiguration configuration)
        {
            var corsOrigins = CorsConfiguration.GetSection().CorsConfigs.Select(x => x.AllowedOrigin).ToList();
            configuration.EnableCors(new EnableCorsAttribute(string.Join(",", corsOrigins), "*", "*"));
        }

        private static void ConfigureConventionBasedRouting(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "v1/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }

        private static void ConfigureAttributeRouting(HttpConfiguration config)
        {
            config.MapHttpAttributeRoutes();
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
