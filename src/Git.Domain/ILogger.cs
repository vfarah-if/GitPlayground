﻿using System;

namespace Git.Domain
{
    public interface ILogger
    {
        void Information(string message);
        void Error(string message, Exception exception);
        void Warning(string message);
        void Debug(string message);
    }
}