using System;
using System.Diagnostics;
using System.Linq;
using Git.Domain;
using Git.Domain.Models.TFL;
using static Git.Domain.Constants.AccidentStatisticSorting;

namespace TestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
            try
            {
                var transportForLondonClient = new TransportForLondonClient(Configuration.Create());
                int currentPage = 1;
                const int PageSize = 20;
                int CurrentAmountOfRecordsRetrieved = PageSize;

                var pagedAccidentStatistics = GetPagedFatalAccidentStatisticsFor2014To2017(transportForLondonClient, currentPage, PageSize, ByDateDescending);
                LogInfo($"{pagedAccidentStatistics.Total} fatal accidents occured");            

                do
                {
                    if (currentPage > 1)
                    {                                                
                        pagedAccidentStatistics = GetPagedFatalAccidentStatisticsFor2014To2017
                            (transportForLondonClient, currentPage, PageSize, ByDateDescending);
                        CurrentAmountOfRecordsRetrieved += pagedAccidentStatistics.Data.Count();
                    }

                    LogInfo($"Page '{pagedAccidentStatistics.Page}' of {CurrentAmountOfRecordsRetrieved} records");
                    foreach (var accidentStatistic in pagedAccidentStatistics.Data)
                    {
                        LogData($"Accident '{accidentStatistic.Id}' occured on '{accidentStatistic.Date.ToLongDateString()} {accidentStatistic.Date.ToLongTimeString()}' at '{accidentStatistic.Location}' with severity '{accidentStatistic.Severity}'");
                    }
                    LogInfo($"Next '{PageSize}' records ...");
                    Console.Read();
                    currentPage += 1;
                }
                while (CurrentAmountOfRecordsRetrieved <= pagedAccidentStatistics.Total);
            }
            catch (Exception e)
            {
                LogError(e, "Failed to get paged transport messages ...");
                Console.Read();
            }
        }

        private static Paged<AccidentStatistic> GetPagedFatalAccidentStatisticsFor2014To2017(
            ITransportForLondonClient transportForLondonClient, 
            int currentPage, 
            int PageSize,
            SortOptions<AccidentStatistic> sortOptions)
        {            
            return transportForLondonClient.GetAccidentStatistics(
                from: DateTime.Parse("01 January 2014 00:00:00"), 
                to: DateTime.Parse("31 December 2017 00:00:00"),
                severity: Severity.Fatal,
                sortOptions: sortOptions,
                page: currentPage, 
                pageSize: PageSize)
                .GetAwaiter()
                .GetResult();
        }

        private static void LogInfo(string message)
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(message);
            Console.ResetColor();
        }

        private static void LogData(string message)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(message);
            Console.ResetColor();
        }

        private static void LogError(Exception e, string message = null)
        {
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            if (!string.IsNullOrEmpty(message))
            {
                Console.WriteLine(message);
            }
            Console.WriteLine(e.Message);
            if (e.InnerException == null)
            {
                return;
            }
            LogError(e.InnerException);
        }
    }
}