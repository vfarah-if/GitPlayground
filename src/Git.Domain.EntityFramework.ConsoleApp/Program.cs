using System;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using Git.Domain.Models.TFL;
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
                LoadAllCycylingAccidents(accidentStatisticDbContext, new DateTime(2005, 01, 01, 1, 1, 1), new DateTime(2017, 12, 31, 1, 1, 1));
                Console.Read();
            }
        }

        private static void LoadAllCycylingAccidents(AccidentStatisticDbContext accidentStatisticDbContext,
            DateTime from, DateTime to)
        {
            // TODO: Generate a repository that creates the same scenario

            // Count the records
            var cyclingAccidentCount = accidentStatisticDbContext.AccidentStatistics
                .Count(accident => 
                    accident.Date >= from && accident.Date <= to &&
                    accident.Severity == Severity.Fatal &&
                    accident.Casualties.Any(casualty => casualty.Mode.Equals("PedalCycle") && casualty.Severity == Severity.Fatal));
            Console.WriteLine($"{cyclingAccidentCount} cycling fatalities in total from {from.ToLongDateString()} to {to.ToLongDateString()}");

            // Get the details and generate a minor report

            var cyclingAccidents = accidentStatisticDbContext.AccidentStatistics
                .Where(accident =>
                    accident.Date >= from && accident.Date <= to &&
                    accident.Severity == Severity.Fatal &&
                    accident.Casualties.Any(casualty => casualty.Mode.Equals("PedalCycle") && casualty.Severity == Severity.Fatal))
                .Include(x => x.Casualties)
                .Include(x => x.Vehicles)
                .AsEnumerable();
            foreach (var cyclingAccident in cyclingAccidents)
            {
                Console.WriteLine($"Cycling accident occured in the borough of {cyclingAccident.Borough.ToUpper()} involving '{cyclingAccident.Casualties.Count}' casualties and '{cyclingAccident.Vehicles.Count}' vehicles.");
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
