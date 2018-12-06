using Git.Domain.EntityFramework.Models;
using Git.Domain.Models.TFL;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Git.Domain.EntityFramework
{
    [ExcludeFromCodeCoverage]
    public class AccidentStatisticDbInitializer : DropCreateDatabaseAlways<AccidentStatisticDbContext>
    {
        public override async void InitializeDatabase(AccidentStatisticDbContext context)
        {
            // Uncomment if you want to delete the database before seeding the data
            // context.Database.Delete();
            if (!context.Database.Exists())
            {
                try
                {
                    context.Database.Create();
                }
                catch (Exception e)
                {
                    Trace.TraceError("Failed to create database as expected because of {0}", e);
                }
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
            ITransportForLondonClient transportForLondonClient = new TransportForLondonClient(Configuration.Create(), Logger.Create());
            var lastYear = DateTime.Now.Year - 1;
            var firstYear = 2005;
            if (IsTestDatabase(context))
            {
                firstYear = 2017;
            }
            for (int year = lastYear; year >= firstYear; year--)
            {
                try
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
                    Trace.TraceInformation($"Pausing to prevent being locked out");
                    Thread.Sleep(10000);
                }
                catch (Exception e)
                {
                    Trace.TraceError($"Failed to get data for year '{year}'", e.Message, e.InnerException?.Message);
                }
            }
        }

        private static bool IsTestDatabase(AccidentStatisticDbContext context)
        {
            return context.Database.Connection.Database.Contains("AccidentStatisticsTestDB");
        }

        private async Task GeneraDataFor(AccidentStatisticDbContext context,
            IReadOnlyList<AccidentStatistic> accidentStatistics)
        {
            Trace.TraceInformation($"Inserting '{accidentStatistics.Count}' records into the database");
            var accidents = new List<AccidentStatisticDb>();
            var vehicles = new List<VehicleDb>();
            var casualties = new List<CasualtyDb>();
            foreach (var accidentStatistic in accidentStatistics)
            {
                AccidentStatisticDb newAccidentStatistic = accidentStatistic.ConvertFrom();
                accidents.Add(newAccidentStatistic);
                vehicles.AddRange(newAccidentStatistic.Vehicles);
                casualties.AddRange(newAccidentStatistic.Casualties);
            }
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
