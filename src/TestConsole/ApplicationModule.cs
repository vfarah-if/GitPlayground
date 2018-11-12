using Autofac;

namespace TestConsole
{
    public class ApplicationModule: Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ApplicationCommand>().AsImplementedInterfaces().SingleInstance();
        }
    }
}
