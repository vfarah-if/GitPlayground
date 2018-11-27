using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace Git.Domain.EntityFramework
{
    public class AccidentStatisticDbInitializer : DropCreateDatabaseAlways<AccidentStatisticDbContext>
    {
        public override async void InitializeDatabase(AccidentStatisticDbContext context)
        {
            // Uncomment if you want to delete the database before seeding the data
            // context.Database.Delete();
            if (!context.Database.Exists())
            {
                context.Database.Create();
            }

            this.Seed(context);
            await context.SaveChangesAsync();
        }

        protected override async void Seed(AccidentStatisticDbContext context)
        {
            if (!context.AccidentStatistics.Any())
            {
                Stopwatch stopwatch = Stopwatch.StartNew();
                await GenerateDataFromLiveFeed(context);
                stopwatch.Stop();
                Trace.TraceWarning($"Took '{stopwatch.Elapsed.ToString()}' to seed the data from the live server");                
            }
            else
            {
                Trace.TraceWarning("Database has already been initialized so seeding will be ignored!");
            }

            base.Seed(context);
        }

        private async Task GenerateDataFromLiveFeed(AccidentStatisticDbContext context)
        {
            Trace.TraceInformation("About to generate data from the TFL live feed ...");
            ITransportForLondonClient transportForLondonClient = new TransportForLondonClient(Configuration.Create());
            var lastYear = DateTime.Now.Year - 1;
            for (int year = lastYear; year >= 2005; year--)
            {
                Trace.TraceInformation($"Getting data for year '{year}'");
                Stopwatch stopwatch = Stopwatch.StartNew();
                var accidentStatistics =
                    await transportForLondonClient.GetAllAccidentStatistics(year).ConfigureAwait(false);
                stopwatch.Stop();
                Trace.TraceInformation($"Took '{stopwatch.Elapsed.ToString()}' to retrieve data for year '{year}'");
                stopwatch = Stopwatch.StartNew();
                await GeneraDataFor(context, accidentStatistics);
                stopwatch.Stop();
                Trace.TraceInformation($"Took '{stopwatch.Elapsed.ToString()}' to insert data for year '{year}' into the local database");
            }
        }

        private async Task GeneraDataFor(AccidentStatisticDbContext context,
            IReadOnlyList<Models.TFL.AccidentStatistic> accidentStatistics)
        {
            Trace.TraceInformation($"Inserting '{accidentStatistics.Count}' records into the database");
            var accidents = new List<AccidentStatistic>();
            var vehicles = new List<Vehicle>();
            var casualties = new List<Casualty>();
            foreach (var accidentStatistic in accidentStatistics)
            {
                Trace.TraceInformation($"Generating '{accidentStatistic.Id}' record for bulk insert");
                var newAccidentStatistic = AccidentStatistic.MapFrom(accidentStatistic);
                accidents.Add(newAccidentStatistic);
                vehicles.AddRange(newAccidentStatistic.Vehicles);
                casualties.AddRange(newAccidentStatistic.Casualties);
            }

            Trace.TraceInformation($"Inserting AccidentStatistics'{accidents.Count}' records into the database");
            await context.BulkInsertAsync(accidents);
            Trace.TraceInformation($"Inserting Vehicles '{vehicles.Count}' records into the database");
            await context.BulkInsertAsync(vehicles);
            Trace.TraceInformation($"Inserting Casualties '{casualties.Count}' records into the database");
            await context.BulkInsertAsync(casualties);
            Trace.TraceInformation("Before Save ...");
            await context.BulkSaveChangesAsync();
            Trace.TraceInformation("After Save ...");                        
        }
    }
}
