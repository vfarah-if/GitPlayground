using System;

namespace TestConsole
{
    public class ConsoleLogger : ILogger
    {
        public void AsData(string message)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine(message);
            Console.ResetColor();
        }

        public void AsInformation(string message)
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine(message);
            Console.ResetColor();
        }

        public void AsError(Exception exception, string message = null)
        {
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            if (!string.IsNullOrEmpty(message))
            {
                Console.WriteLine(message);
            }
            Console.WriteLine(exception.Message);
            if (exception.InnerException == null)
            {
                return;
            }
            AsError(exception.InnerException);
        }
    }
}
