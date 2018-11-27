using System;
using System.Diagnostics;
using System.Linq;

namespace Git.Domain.EntityFramework.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            ConfigureTraceListener();
            using (var accidentStatisticDbContext = new AccidentStatisticDbContext())
            {
                Console.WriteLine($"{accidentStatisticDbContext.AccidentStatistics.Count()} Accident Statistic records found");
                Console.WriteLine($"{accidentStatisticDbContext.Vehicles.Count()} Vehicle records found");
                Console.WriteLine($"{accidentStatisticDbContext.Casualties.Count()} Casualty records found");
                Console.Read();
            }
        }

        private static void ConfigureTraceListener()
        {
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
        }
    }
}
