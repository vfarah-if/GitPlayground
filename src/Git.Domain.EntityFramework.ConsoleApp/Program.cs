using System;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Git.Domain.Models.TFL;
using Console = System.Console;

using static Git.Domain.EntityFramework.SortOptions<Git.Domain.EntityFramework.Models.AccidentStatisticDb>;

namespace Git.Domain.EntityFramework.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            ConfigureTraceListener();
            using (var accidentStatisticDbContext = new AccidentStatisticDbContext())
            {
                var accidentStatisticRepository = new AccidentStatisticRepository(accidentStatisticDbContext);
                var accidentCount = accidentStatisticRepository.Count().GetAwaiter().GetResult();
                Console.WriteLine($"{accidentCount} Accident Statistic records found");
                Console.WriteLine($"{accidentStatisticDbContext.Vehicles.LongCountAsync().GetAwaiter().GetResult()} Vehicle records found");
                Console.WriteLine($"{accidentStatisticDbContext.Casualties.LongCountAsync().GetAwaiter().GetResult()} Casualty records found");
                LoadAllCyclingAccidents(accidentStatisticDbContext, new DateTime(2005, 01, 01, 1, 1, 1), new DateTime(2017, 12, 31, 1, 1, 1)).GetAwaiter().GetResult();
                Console.Read();
            }
        }

        private static async Task LoadAllCyclingAccidents(AccidentStatisticDbContext accidentStatisticDbContext,
            DateTime from, DateTime to)
        {
            var repository = new AccidentStatisticRepository(accidentStatisticDbContext);
            int? nextPage = 1;
            do
            {
                var result = await repository.Get(filter =>
                        filter.Date >= from && filter.Date <= to &&
                        filter.Severity == Severity.Fatal &&
                        filter.Casualties.Any(casualty =>
                            casualty.Mode.Equals("PedalCycle") && casualty.Severity == Severity.Fatal),
                    OrderBy(x => x.Borough, false), 
                    nextPage.Value);

                Console.WriteLine($"Displaying Page {nextPage} returning '{result.PageSize}' records of '{result.Total}' cycling fatalities in total from {from.ToLongDateString()} to {to.ToLongDateString()} ...");
                foreach (var cyclingAccident in result.Data)
                {
                    Console.WriteLine($"Cycling accident occured in the borough of {cyclingAccident.Borough.ToUpper()} involving '{cyclingAccident.Casualties.Count}' casualties and '{cyclingAccident.Vehicles.Count}' vehicles.");
                }
                nextPage = result.NextPage;
            } while (nextPage.HasValue);
        }

        private static void ConfigureTraceListener()
        {
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
        }
    }
}
