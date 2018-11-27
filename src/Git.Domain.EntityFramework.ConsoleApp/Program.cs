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
                Console.Write($"{accidentStatisticDbContext.AccidentStatistics.Count()} Accident Statistic records found");
                Console.Read();
            }
        }

        private static void ConfigureTraceListener()
        {
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
        }
    }
}
