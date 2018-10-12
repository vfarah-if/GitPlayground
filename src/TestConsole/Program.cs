using System;
using Git.Domain;

namespace TestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            try
            {
                var transportForLondonClient = new TransportForLondonClient();
                int currentPage = 1;
                const int PageSize = 10;

                var pagedAccidentStatistics = transportForLondonClient.GetPagedAccidentStatistics(2017, currentPage, PageSize).Result;
                Console.WriteLine($"{pagedAccidentStatistics.Total} accidents occured");            

                while ((currentPage * PageSize) <= pagedAccidentStatistics.Total)
                {
                    Console.WriteLine($"Page '{pagedAccidentStatistics.Page}' of {pagedAccidentStatistics.PageSize} records");
                    foreach (var accidentStatistic in pagedAccidentStatistics.Data)
                    {
                        Console.WriteLine($"Accident occured on '{accidentStatistic.Date.ToLongDateString()} {accidentStatistic.Date.ToLongTimeString()}' at '{accidentStatistic.Location}' with severity '{accidentStatistic.Severity}'");
                    }
                    Console.WriteLine($"Next '{PageSize}' records ...");
                    Console.Read();
                    currentPage += 1;
                    pagedAccidentStatistics = transportForLondonClient.GetPagedAccidentStatistics(2017, currentPage, PageSize).Result;
                }
            }
            catch (Exception e)
            {
                LogError(e, "Failed to get paged transport messages ...");
                Console.Read();
            }
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
