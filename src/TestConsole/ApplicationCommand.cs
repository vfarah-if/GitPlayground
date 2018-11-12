using Git.Domain;
using Git.Domain.Models.TFL;
using System;
using static Git.Domain.Constants.AccidentStatisticSorting;

namespace TestConsole
{
    public class ApplicationCommand : IApplicationCommand
    {
        private const int PageSize = 20;
        private readonly ITransportForLondonClient transportForLondonClient;

        public ApplicationCommand(ITransportForLondonClient transportForLondonClient)
        {
            this.transportForLondonClient = transportForLondonClient;
        }

        public void Execute()
        {
            int currentPage = 1;
            int CurrentAmountOfRecordsRetrieved = PageSize;
            Paged<AccidentStatistic> pagedAccidentStatistics;
            do
            {
                pagedAccidentStatistics = GetPagedFatalAccidentStatisticsFor2014To2017(currentPage, ByDateDescending);
                LogInfo($"{pagedAccidentStatistics.Total} fatal accidents occured");
                LogInfo($"Page '{pagedAccidentStatistics.Page}' of '{pagedAccidentStatistics.LastPage}' pages with {CurrentAmountOfRecordsRetrieved} records");
                foreach (var accidentStatistic in pagedAccidentStatistics.Data)
                {
                    LogData($"{Enum.GetName(typeof(Severity), accidentStatistic.Severity)} Accident occured on '{accidentStatistic.Date.ToLongDateString()} {accidentStatistic.Date.ToLongTimeString()}' at '{accidentStatistic.Location}' with severity '{accidentStatistic.Severity}'");
                }
                LogInfo($"Next '{PageSize}' records ...");
                currentPage += 1;
                CurrentAmountOfRecordsRetrieved += pagedAccidentStatistics.PageSize;
                Console.Read();

            } while (pagedAccidentStatistics.NextPage.HasValue);
        }

        private Paged<AccidentStatistic> GetPagedFatalAccidentStatisticsFor2014To2017(
            int page,
            SortOptions<AccidentStatistic> sortOptions)
        {
            return transportForLondonClient.GetAccidentStatistics(
                    from: DateTime.Parse("01 January 2017 00:00:00"),
                    to: DateTime.Parse("31 December 2017 00:00:00"),
                    severity: Severity.Fatal,
                    sortOptions: sortOptions,
                    page: page,
                    pageSize: PageSize)
                .GetAwaiter()
                .GetResult();
        }

        private static void LogData(string message)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(message);
            Console.ResetColor();
        }

        private static void LogInfo(string message)
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(message);
            Console.ResetColor();
        }
    }
}
