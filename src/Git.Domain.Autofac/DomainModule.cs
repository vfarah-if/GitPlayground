using System.Diagnostics.CodeAnalysis;
using Autofac;

namespace Git.Domain.Autofac
{
    [ExcludeFromCodeCoverage]
    public class DomainModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<TransportForLondonClient>().AsImplementedInterfaces().SingleInstance();
            builder.Register(x => Configuration.Create()).AsImplementedInterfaces().SingleInstance();
        }
    }
}
