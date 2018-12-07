using System;
using AutoFixture;
using Moq;
using Moq.AutoMock;
using Xunit;

namespace Git.Domain.UnitTests
{
    public class LoggerShould: IDisposable
    {
        private readonly AutoMocker _autoMocker;
        private readonly Logger _subject;
        private readonly Mock<Serilog.ILogger> _seriLoggerMock;
        private readonly Fixture _autoFixture;
        private readonly string _message;

        public LoggerShould()
        {
            _autoMocker = new AutoMocker();
            _subject = _autoMocker.CreateInstance<Logger>();
            _seriLoggerMock = _autoMocker.GetMock<Serilog.ILogger>();            
            _autoFixture = new Fixture();
            _message = _autoFixture.Create<string>();
        }

        [Fact]
        public void VerifyInformationMessage()
        {
            _seriLoggerMock.Setup(x => x.Information(It.IsAny<string>()));

            _subject.Information(_message);

            _seriLoggerMock.Verify(x => x.Information(_message));
        }

        [Fact]
        public void VerifyDebugMessage()
        {
            _seriLoggerMock.Setup(x => x.Debug(It.IsAny<string>()));

            _subject.Debug(_message);

            _seriLoggerMock.Verify(x => x.Debug(_message));
        }

        [Fact]
        public void VerifyWarningMessage()
        {
            _seriLoggerMock.Setup(x => x.Warning(It.IsAny<string>()));

            _subject.Warning(_message);

            _seriLoggerMock.Verify(x => x.Warning(_message));
        }

        [Fact]
        public void VerifyErrorMessage()
        {            
            var exception = _autoFixture.Create<Exception>();
            _seriLoggerMock.Setup(x => x.Error(It.IsAny<Exception>(), It.IsAny<string>()));

            _subject.Error(_message, exception);

            _seriLoggerMock.Verify(x => x.Error(exception, _message));
        }

        public void Dispose()
        {
            _subject.Dispose();
        }
    }
}
