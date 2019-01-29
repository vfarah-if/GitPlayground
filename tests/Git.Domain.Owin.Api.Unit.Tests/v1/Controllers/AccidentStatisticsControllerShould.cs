using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using AutoFixture;
using FluentAssertions;
using Git.Domain;
using Git.Domain.Models;
using Git.Owin.Api.Models;
using Git.Owin.Api.v1.ApiControllers;
using Git.Owin.Api.v1.Services;
using Moq;
using Moq.AutoMock;
using Xunit;

namespace Git.Owin.Api.Unit.Tests.v1.Controllers
{
    public class AccidentStatisticsControllerShould
    {
        private readonly AutoMocker _autoMocker;
        private readonly AccidentStatisticsController _subject;
        private readonly Mock<IAccidentStatisticsService> _accidentStatisticsServiceMock;
        private readonly Fixture _autoFixture;
        private Paging<AccidentStatistic> _pagingResult;
        private AccidentStatisticsQuery _accidentStatisticsQuery;

        public AccidentStatisticsControllerShould()
        {
            _autoMocker = new AutoMocker();
            _subject = _autoMocker.CreateInstance<AccidentStatisticsController>();
            _subject.Request = new HttpRequestMessage();
            _subject.Configuration = new HttpConfiguration();
            _autoFixture = new Fixture();
            _pagingResult = _autoFixture.Create<Paging<AccidentStatistic>>();
            _accidentStatisticsServiceMock = _autoMocker.GetMock<IAccidentStatisticsService>();
            _accidentStatisticsServiceMock.Setup(x => x.GetAccidentStatistics(It.IsAny<AccidentStatisticsQuery>()))
                .ReturnsAsync(() => _pagingResult);
            _accidentStatisticsQuery = _autoFixture.Create<AccidentStatisticsQuery>();
        }

        [Fact]
        public async Task GetAccidentStatisticsViaTheAccidentStatisticsService()
        {
            await _subject.Get(_accidentStatisticsQuery);

            _accidentStatisticsServiceMock.Verify(x => x.GetAccidentStatistics(_accidentStatisticsQuery));
        }

        [Fact]
        public async Task GetReturnsStatusCode200()
        {
            var actual = await _subject.Get(_accidentStatisticsQuery);

            actual.StatusCode.Should().Be(HttpStatusCode.OK);
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
        public async Task ReturnABadRequestWhenModelStateHasErrorsAndSendInformationBackToTheUserAboutInvalidModelState()
        {
            var expectedFieldThatWillFail = "from";
            var expectedErrorUserErrorMessage = "Need an invalid message to go down the bad route";
            _subject.ModelState.AddModelError(expectedFieldThatWillFail, expectedErrorUserErrorMessage);

            var result = await _subject.Get(_accidentStatisticsQuery);

            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            var content = await result.Content.ReadAsStringAsync();
            content.Should().Contain(expectedFieldThatWillFail);
            content.Should().Contain(expectedErrorUserErrorMessage);
        }
    }
}
