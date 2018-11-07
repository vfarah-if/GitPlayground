using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.v1.ApiControllers;
using Git.Domain.Owin.Api.v1.Models;
using Git.Domain.Owin.Api.v1.Services;
using Moq;
using Moq.AutoMock;
using Xunit;

namespace Git.Domain.Owin.Api.Unit.Tests.v1.Controllers
{
    public class AccidentStatisticsControllerShould
    {
        private readonly AutoMocker _autoMocker;
        private readonly AccidentStatisticsController _subject;
        private readonly Mock<IAccidentStatisticsService> _accidentStatisticsServiceMock;
        private readonly Fixture _autoFixture;
        private Paged<AccidentStatistic> _pagedResult;
        private AccidentStatisticsQuery _accidentStatisticsQuery;

        public AccidentStatisticsControllerShould()
        {
            _autoMocker = new AutoMocker();
            _subject = _autoMocker.CreateInstance<AccidentStatisticsController>();
            _subject.Request = new HttpRequestMessage();
            _autoFixture = new Fixture();
            _pagedResult = _autoFixture.Create<Paged<AccidentStatistic>>();
            _accidentStatisticsServiceMock = _autoMocker.GetMock<IAccidentStatisticsService>();
            _accidentStatisticsServiceMock.Setup(x => x.GetAccidentStatistics(It.IsAny<AccidentStatisticsQuery>()))
                .ReturnsAsync(() => _pagedResult);
            _accidentStatisticsQuery = _autoFixture.Create<AccidentStatisticsQuery>();
        }

        [Fact]
        public void ThrowNullArgumentExceptionWhenGetAccidentStatisticsIsAssignedANullQuery()
        {
            Func<Task> getAction = async () => await _subject.Get(null);

            getAction.Should().Throw<ArgumentNullException>();
        }

        [Fact]
        public async Task GetAccidentStatisticsViaTheAccidentStatisticsService()
        {

            await _subject.Get(_accidentStatisticsQuery);

            _accidentStatisticsServiceMock.Verify(x => x.GetAccidentStatistics(_accidentStatisticsQuery));
        }

        [Fact]
        public async Task GetAccidentStatisticsShouldReturnABadRequestWhenAccidentServiceThrowsAnyException()
        {
            _accidentStatisticsServiceMock.Setup(x => x.GetAccidentStatistics(It.IsAny<AccidentStatisticsQuery>()))
                .Throws<Exception>();

            var result = await _subject.Get(_accidentStatisticsQuery);

            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task GetAccidentStatisticsShouldReturnABadRequestWhenModelStateIsInvalid()
        {
            var result = await _subject.Get(_accidentStatisticsQuery);

            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
    }
}
