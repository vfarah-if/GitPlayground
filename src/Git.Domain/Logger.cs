﻿using System;
using System.Diagnostics.CodeAnalysis;
using Serilog;

namespace Git.Domain
{
    [ExcludeFromCodeCoverage]
    public class Logger : ILogger
    {
        private readonly Serilog.ILogger _logger;

        public Logger(Serilog.ILogger logger)
        {
            _logger = logger;
        }

        public void Information(string message)
        {
            _logger.Information(message);
        }

        public void Error(string message, Exception exception)
        {
            _logger.Error(exception, message);
        }

        public void Warning(string message)
        {
            _logger.Warning(message);
        }

        public void Debug(string message)
        {
            _logger.Debug(message);
        }

        public static ILogger Create()
        {
            return new Logger(new LoggerConfiguration().CreateLogger());
        }
    }
}
