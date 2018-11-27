using System;
using System.Linq;

namespace Git.Domain.EntityFramework.ConsoleApp
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var accidentStatisticDbContext = new AccidentStatisticDbContext())
            {
                Console.Write($"{accidentStatisticDbContext.AccidentStatistics.Count()} Accident Statistic records found");
                Console.Read();
            }
        }
    }
}
