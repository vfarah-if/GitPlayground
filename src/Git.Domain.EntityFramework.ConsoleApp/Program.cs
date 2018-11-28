using System;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using Console = System.Console;

namespace Git.Domain.EntityFramework.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            ConfigureTraceListener();
            using (var accidentStatisticDbContext = new AccidentStatisticDbContext())
            {
                LogAllDatabaseActivities(accidentStatisticDbContext);
                Console.WriteLine($"{accidentStatisticDbContext.AccidentStatistics.LongCountAsync().GetAwaiter().GetResult()} Accident Statistic records found");
                Console.WriteLine($"{accidentStatisticDbContext.Vehicles.LongCountAsync().GetAwaiter().GetResult()} Vehicle records found");
                Console.WriteLine($"{accidentStatisticDbContext.Casualties.LongCountAsync().GetAwaiter().GetResult()} Casualty records found");
                Console.Read();
            }
        }

        private static void LogAllDatabaseActivities(AccidentStatisticDbContext accidentStatisticDbContext)
        {
            accidentStatisticDbContext.Database.Log = (sql) =>
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine(sql);
                Console.ForegroundColor = ConsoleColor.White;
            };
        }

        private static void ConfigureTraceListener()
        {
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
        }
    }
}
