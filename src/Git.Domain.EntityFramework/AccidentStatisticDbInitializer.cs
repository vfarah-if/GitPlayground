using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Diagnostics;
using System.Linq;

namespace Git.Domain.EntityFramework
{
    public class AccidentStatisticDbInitializer : DropCreateDatabaseAlways<AccidentStatisticDbContext>
    {
        protected override void Seed(AccidentStatisticDbContext context)
        {
            if (!context.AccidentStatistics.Any())
            {
                GenerateDataFromLiveFeed(context);
            }
            else
            {
                Trace.TraceWarning("Database has already been initialized so seeding will be ignored!");
            }
            base.Seed(context);
        }

        private void GenerateDataFromLiveFeed(AccidentStatisticDbContext context)
        {
            Trace.TraceInformation("About to generate data from the TFL live feed ...");
//            ITransportForLondonClient transportForLondonClient = new TransportForLondonClient(Configuration.Create());
//            var lastYear = DateTime.Now.Year - 1;
//            for (int year = lastYear; year >= 2005 ; year--)
//            {
//                Trace.TraceInformation($"Getting data for year '{year}'");
//                var accidentStatistics = transportForLondonClient.GetAllAccidentStatistics(year).GetAwaiter().GetResult();
//                GeneraDataFor(context, accidentStatistics);
//            }
        }

        private void GeneraDataFor(AccidentStatisticDbContext context, IReadOnlyList<Models.TFL.AccidentStatistic> accidentStatistics)
        {
            // TODO: Update to some bulk insert version
            Trace.TraceInformation($"Inserting '{accidentStatistics.Count}' records into the database");
            foreach (var accidentStatistic in accidentStatistics)
            {
                var newAccidentStatistic = AccidentStatistic.MapFrom(accidentStatistic);
                Trace.TraceInformation($"Inserting '{newAccidentStatistic.Location}' record into the database");
                context.AccidentStatistics.AddOrUpdate(newAccidentStatistic);
                context.SaveChanges();
                Trace.TraceInformation($"Inserted '{newAccidentStatistic.Location}' record into the database");
            }
        }
    }
}
