using System.Diagnostics.CodeAnalysis;
using Autofac;
using Git.Domain.EntityFramework;

namespace Git.Domain.Autofac
{
    [ExcludeFromCodeCoverage]
    public class DomainModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<TransportForLondonClient>().AsImplementedInterfaces().SingleInstance();
            builder.Register(x => Configuration.Create()).AsImplementedInterfaces().SingleInstance();
            builder.RegisterType<AccidentStatisticRepository>().AsImplementedInterfaces().InstancePerLifetimeScope();
            builder.RegisterType<AccidentStatisticDbContext>().AsImplementedInterfaces().InstancePerLifetimeScope();
        }
    }
}
