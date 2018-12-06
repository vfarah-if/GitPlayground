using System;
using Autofac;
using Git.Domain;
using Git.Domain.Autofac;

namespace TestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            CreateLifetimeScope(scope =>
                {

                    try
                    {
                        var applicationCommand = scope.Resolve<IApplicationCommand>();
                        applicationCommand.Execute().GetAwaiter().GetResult();
                    }
                    catch (Exception e)
                    {
                        var logger = scope.Resolve<ILogger>();
                        logger.Error("Failed to get paged transport messages ...", e);
                    }
                    finally
                    {
                        Console.Read();
                    }
                });
        }

        private static void CreateLifetimeScope(Action<ILifetimeScope> action)
        {
            using (var scope = BuildAndCreateContainer().BeginLifetimeScope())
            {
                action?.Invoke(scope);
            }
        }

        private static IContainer BuildAndCreateContainer()
        {
            var builder = new ContainerBuilder();
            builder.RegisterAssemblyModules(typeof(DomainModule).Assembly, typeof(ApplicationModule).Assembly);
            var container = builder.Build();
            return container;
        }
    }
}