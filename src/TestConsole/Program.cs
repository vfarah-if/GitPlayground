using System;
using Git.Domain;

namespace TestConsole
{
    class Program
    {
        static void Main(string[] args)
        {
            var transportForLondonClient = new TransportForLondonClient();
            var accidentStatistics = transportForLondonClient.GetAccidentStatistics(2017).Result;
            Console.WriteLine($"{accidentStatistics.Count} accidents occured");
            foreach (var accidentStatistic in accidentStatistics)
            {
                Console.WriteLine($"Accident occured on '{accidentStatistic.Date.ToLongDateString()} {accidentStatistic.Date.ToLongTimeString()}' at '{accidentStatistic.Location}' with severity '{accidentStatistic.Severity}'");
            }

            Console.Read();
        }
    }
}
