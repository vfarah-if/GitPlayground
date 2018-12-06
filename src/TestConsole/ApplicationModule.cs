using System.Diagnostics.CodeAnalysis;
using Autofac;
using Git.Domain;
using Serilog;

namespace TestConsole
{
    [ExcludeFromCodeCoverage]
    public class ApplicationModule: Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ApplicationCommand>().AsImplementedInterfaces().SingleInstance();
            builder.Register<Serilog.ILogger>((a, b) =>
                new LoggerConfiguration()
                    .MinimumLevel.Debug()
                    .WriteTo.Console()
                    .CreateLogger()).AsSelf();
            builder.RegisterType<Logger>().AsImplementedInterfaces().SingleInstance();
        }
    }
}
