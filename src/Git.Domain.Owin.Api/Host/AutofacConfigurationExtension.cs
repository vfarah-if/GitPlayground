using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using Git.Domain.Autofac;
using Owin;

namespace Git.Domain.Owin.Api.Host
{
    // Reference https://github.com/autofac/Examples/blob/master/src/WebApiExample.OwinSelfHost/Startup.cs
    [ExcludeFromCodeCoverage]
    public static class AutofacConfigurationExtension
    {
        public static void UseAutofac(this IAppBuilder appBuilder, HttpConfiguration httpConfiguration)
        {
            Initialize(appBuilder, BuildAndCreateContainer(httpConfiguration), httpConfiguration);
        }

        private static void Initialize(IAppBuilder appBuilder, ILifetimeScope lifetimeScope, HttpConfiguration httpConfiguration)
        {
            appBuilder.UseAutofacMiddleware(lifetimeScope);
            // Again, the alternative to "UseAutofacMiddleware" is something like this:
            // appBuilder.UseAutofacLifetimeScopeInjector(container);
            // appBuilder.UseMiddlewareFromContainer<FirstMiddleware>();
            // appBuilder.UseMiddlewareFromContainer<SecondMiddleware>();

            // Make sure the Autofac lifetime scope is passed to Web API.
            appBuilder.UseAutofacWebApi(httpConfiguration);
        }

        private static IContainer BuildAndCreateContainer(HttpConfiguration httpConfiguration)
        {
            var builder = new ContainerBuilder();
            builder.RegisterAssemblyModules<DomainModule>(typeof(DomainModule).Assembly);
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            // OPTIONAL - Register the filter provider if you have custom filters that need DI.
            // Also hook the filters up to controllers.
            // builder.RegisterWebApiFilterProvider(httpConfiguration);
            // builder.RegisterType<CustomActionFilter>()
            //    .AsWebApiActionFilterFor<TestController>()
            //    .InstancePerRequest();
            
            // Add any local modules here

            var container = builder.Build();
            httpConfiguration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = httpConfiguration.DependencyResolver;

            return container;
        }
    }
}
