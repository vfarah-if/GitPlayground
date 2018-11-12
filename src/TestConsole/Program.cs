using System;
using System.Diagnostics;
using Autofac;
using Git.Domain.Autofac;

namespace TestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            ConfigureTraceListener();
            try
            {
                CreateLifetimeScope(scope =>
                {
                    var applicationCommand = scope.Resolve<IApplicationCommand>();
                    applicationCommand.Execute();
                });
            }
            catch (Exception e)
            {
                LogError(e, "Failed to get paged transport messages ...");
                Console.Read();
            }
        }

        private static void ConfigureTraceListener()
        {
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
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

        private static void LogError(Exception e, string message = null)
        {
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            if (!string.IsNullOrEmpty(message))
            {
                Console.WriteLine(message);
            }
            Console.WriteLine(e.Message);
            if (e.InnerException == null)
            {
                return;
            }
            LogError(e.InnerException);
        }
    }
}