using System.Diagnostics.CodeAnalysis;
using Autofac;

namespace TestConsole
{
    [ExcludeFromCodeCoverage]
    public class ApplicationModule: Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ApplicationCommand>().AsImplementedInterfaces().SingleInstance();
            builder.RegisterType<ConsoleLogger>().AsImplementedInterfaces().SingleInstance();            
        }
    }
}
