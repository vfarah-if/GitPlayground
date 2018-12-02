using System.Diagnostics.CodeAnalysis;
using Autofac;
using Git.Domain.Owin.Api.v1.Services;
using Git.Domain.Owin.Api.v2.Services;

namespace Git.Domain.Owin.Api.Host.Modules
{
    [ExcludeFromCodeCoverage]
    public class ApiModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<AccidentStatisticsService>().AsImplementedInterfaces().SingleInstance();
            builder.RegisterType<AccidentsService>().AsImplementedInterfaces().InstancePerLifetimeScope();
        }
}
}
