using System;
using System.Diagnostics;
using System.Linq;
using Git.Domain;
using Git.Domain.Models.TFL;

namespace TestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            Trace.Listeners.Add(new TextWriterTraceListener(Console.Out));
            try
            {
                var transportForLondonClient = new TransportForLondonClient();
                var sortOptions = new SortOptions<AccidentStatistic>(SortIt<AccidentStatistic>.With(x => x.Date));
                int currentPage = 1;
                const int PageSize = 10;
                int CurrentAmountOfRecordsRetrieved = PageSize;

                var pagedAccidentStatistics = GetPagedAccidentStatistics(transportForLondonClient, currentPage, PageSize, sortOptions);
                LogInfo($"{pagedAccidentStatistics.Total} fatal accidents occured");            

                do
                {
                    if (currentPage > 1)
                    {                                                
                        pagedAccidentStatistics = GetPagedAccidentStatistics(transportForLondonClient, currentPage, PageSize, sortOptions);
                        CurrentAmountOfRecordsRetrieved += pagedAccidentStatistics.Data.Count();
                    }

                    LogInfo($"Page '{pagedAccidentStatistics.Page}' of {CurrentAmountOfRecordsRetrieved} records");
                    foreach (var accidentStatistic in pagedAccidentStatistics.Data)
                    {
                        LogData($"Accident occured on '{accidentStatistic.Date.ToLongDateString()} {accidentStatistic.Date.ToLongTimeString()}' at '{accidentStatistic.Location}' with severity '{accidentStatistic.Severity}'");
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

        private static Paged<AccidentStatistic> GetPagedAccidentStatistics(
            TransportForLondonClient transportForLondonClient, 
            int currentPage, 
            int PageSize,
            SortOptions<AccidentStatistic> sortOptions)
        {            
            return transportForLondonClient.GetPagedAccidentStatistics(
                2017, 
                currentPage, 
                PageSize, 
                statistic => statistic.Severity == Severity.Fatal,
                sortOptions).Result;
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
            if (e.InnerException == null) return;
            LogError(e.InnerException);
        }
    }
}
