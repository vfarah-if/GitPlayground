using System;

namespace TestConsole
{
    public interface ILogger
    {
        void AsData(string message);
        void AsInformation(string message);
        void AsError(Exception exception, string message = null);
    }
}