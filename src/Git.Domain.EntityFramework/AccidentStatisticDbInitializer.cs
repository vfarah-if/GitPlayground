using Git.Domain.EntityFramework.Models;
using Git.Domain.Models;
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
        private readonly ILogger _logger;

        public AccidentStatisticDbInitializer(ILogger logger)
        {
            _logger = logger ?? Logger.Create();
        }

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
                    _logger.Error("Failed to create database as expected because of {0}", e);
                }
            }

            Seed(context);
            await context.SaveChangesAsync();
        }

        protected override async void Seed(AccidentStatisticDbContext context)
        {
            if (!context.AccidentStatistics.Any())
            {
                Stopwatch stopwatch = Stopwatch.StartNew();
                await GenerateDataFromLiveFeed(context);
                stopwatch.Stop();
                _logger.Debug($"Took '{stopwatch.Elapsed.ToString()}' to seed the data from the live server");
            }
            else
            {
                _logger.Debug("Database has already been initialized so seeding will be ignored!");
            }

            base.Seed(context);
        }

        private async Task GenerateDataFromLiveFeed(AccidentStatisticDbContext context)
        {
            _logger.Debug("About to generate data from the TFL live feed");
            var configuration = Configuration.Create();
            var logger = Logger.Create();
            ITransportForLondonClient transportForLondonClient = new TransportForLondonClient(configuration, logger);
            var lastYear = configuration.MaximumYear;
            var firstYear = 2005;
            if (IsTestDatabase(context))
            {
                firstYear = 2017;
            }
            for (int year = lastYear; year >= firstYear; year--)
            {
                try
                {
                    _logger.Information($"Getting data for year '{year}'");
                    Stopwatch stopwatch = Stopwatch.StartNew();
                    var accidentStatistics =
                        await transportForLondonClient.GetAllAccidentStatistics(year).ConfigureAwait(false);
                    stopwatch.Stop();
                    _logger.Debug($"Took '{stopwatch.Elapsed.ToString()}' to retrieve data for year '{year}'");
                    stopwatch = Stopwatch.StartNew();
                    await GeneraDataFor(context, accidentStatistics);
                    stopwatch.Stop();
                    _logger.Debug($"Took '{stopwatch.Elapsed.ToString()}' to insert data for year '{year}' into the local database");
                    _logger.Debug($"Pausing to prevent being locked out");
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
            _logger.Information($"Inserting '{accidentStatistics.Count}' records into the database");
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
            _logger.Debug($"Inserting Vehicles '{vehicles.Count}' records into the database");
            await context.BulkInsertAsync(vehicles);
            _logger.Debug($"Inserting Casualties '{casualties.Count}' records into the database");
            await context.BulkInsertAsync(casualties);
            _logger.Debug("Saving all bulk inserted records");
            await context.BulkSaveChangesAsync();
            _logger.Debug("All bulk inserted records saved");
        }
    }
}
