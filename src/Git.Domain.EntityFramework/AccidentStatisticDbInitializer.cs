using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace Git.Domain.EntityFramework
{
    public class AccidentStatisticDbInitializer : DropCreateDatabaseAlways<AccidentStatisticDbContext>
    {
        public override void InitializeDatabase(AccidentStatisticDbContext context)
        {
            //            context.Database.Delete();
            if (!context.Database.Exists())
            {
                context.Database.Create();
            }

            this.Seed(context);
            // context.SaveChanges();

            // Comment above and uncomment below for typical create and drop functionality
            // base.InitializeDatabase(context);
        }

        protected override async void Seed(AccidentStatisticDbContext context)
        {
            if (!context.AccidentStatistics.Any())
            {
                await GenerateDataFromLiveFeed(context);
            }
            else
            {
                Trace.TraceWarning("Database has already been initialized so seeding will be ignored!");
            }

            base.Seed(context);
        }

        private async Task GenerateDataFromLiveFeed(AccidentStatisticDbContext context)
        {
            // Speed up inserts
            context.Configuration.AutoDetectChangesEnabled = false;
            context.Configuration.ValidateOnSaveEnabled = false;

            Trace.TraceInformation("About to generate data from the TFL live feed ...");
            ITransportForLondonClient transportForLondonClient = new TransportForLondonClient(Configuration.Create());
            var lastYear = DateTime.Now.Year - 1;
            for (int year = lastYear; year >= 2005; year--)
            {
                Trace.TraceInformation($"Getting data for year '{year}'");
                var accidentStatistics =
                    await transportForLondonClient.GetAllAccidentStatistics(year).ConfigureAwait(false);
                await GeneraDataFor(context, accidentStatistics);
            }
        }

        private async Task GeneraDataFor(AccidentStatisticDbContext context,
            IReadOnlyList<Models.TFL.AccidentStatistic> accidentStatistics)
        {
            // TODO: Update to some bulk insert version
            Trace.TraceInformation($"Inserting '{accidentStatistics.Count}' records into the database");
            foreach (var accidentStatistic in accidentStatistics)
            {
                var newAccidentStatistic = AccidentStatistic.MapFrom(accidentStatistic);
                Trace.TraceInformation($"Inserting '{newAccidentStatistic.TflId}' record into the database");
                context.AccidentStatistics.AddOrUpdate(newAccidentStatistic);
                await context.SaveChangesAsync();
                Trace.TraceInformation(
                    $"Inserted '{newAccidentStatistic.AccidentStatisticId}' record into the database");
            }
        }
    }
}
