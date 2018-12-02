using System.Linq;
using Git.Domain.Owin.Api.v2.ApiControllers;
using System.Net.Http;
using System.Web.Http;
using AutoFixture;
using Moq.AutoMock;
using Git.Domain.EntityFramework.Models;
using Git.Domain.Owin.Api.Models;
using Git.Domain.Owin.Api.v2.Services;
using Moq;
using Xunit;
using System.Threading.Tasks;
using FluentAssertions;
using System;
using System.Net;

namespace Git.Domain.Owin.Api.Unit.Tests.v2.Controllers
{
    public class AccidentsControllerShould
    {
        private readonly AutoMocker _autoMocker;
        private readonly AccidentsController _subject;
        private readonly AccidentStatisticsQuery _accidentStatisticsQuery;
        private Fixture _autoFixture;
        private Paged<AccidentStatisticDb> _pagedResult;
        private Mock<IAccidentsService> _accidentsServiceMock;

        public AccidentsControllerShould()
        {
            _autoMocker = new AutoMocker();
            _subject = _autoMocker.CreateInstance<AccidentsController>();
            _subject.Request = new HttpRequestMessage();
            _subject.Configuration = new HttpConfiguration();
            _autoFixture = new Fixture();
            // Cater for EF internal self referencing objects that can cause recursion
            _autoFixture.Behaviors
                .OfType<ThrowingRecursionBehavior>()
                .ToList().ForEach(b => _autoFixture.Behaviors.Remove(b));
            _autoFixture.Behaviors.Add(new OmitOnRecursionBehavior(1));

            _pagedResult = _autoFixture.Create<Paged<AccidentStatisticDb>>();
            _accidentsServiceMock = _autoMocker.GetMock<IAccidentsService>();
            _accidentsServiceMock.Setup(x => x.GetAccidentsAsync(It.IsAny<AccidentStatisticsQuery>()))
                .ReturnsAsync(() => _pagedResult);
            _accidentStatisticsQuery = _autoFixture.Create<AccidentStatisticsQuery>();
        }

        [Fact]
        public async Task GetAccidentsUsingTheAccidentsService()
        {
            await _subject.GetAccidents(_accidentStatisticsQuery);

            _accidentsServiceMock.Verify(x => x.GetAccidentsAsync(_accidentStatisticsQuery));
        }

        [Fact]
        public async Task GetAccidentsReturnsStatusCodeOfOK()
        {
            var actual = await _subject.GetAccidents(_accidentStatisticsQuery);

            actual.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task GetAccidentStatisticsShouldReturnABadRequestWhenAccidentServiceThrowsAnyException()
        {
            _accidentsServiceMock.Setup(x => x.GetAccidentsAsync(It.IsAny<AccidentStatisticsQuery>()))
                .Throws<Exception>();

            var result = await _subject.GetAccidents(_accidentStatisticsQuery);

            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task ReturnABadRequestWhenModelStateHasErrorsAndSendInformationBackToTheUserAboutInvalidModelState()
        {
            var expectedFieldThatWillFail = "from"; 
            var expectedErrorUserErrorMessage = "Need an invalid message to go down the bad route";
            _subject.ModelState.AddModelError(expectedFieldThatWillFail, expectedErrorUserErrorMessage);

            var result = await _subject.GetAccidents(_accidentStatisticsQuery);

            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            var content = await result.Content.ReadAsStringAsync();
            content.Should().Contain(expectedFieldThatWillFail);
            content.Should().Contain(expectedErrorUserErrorMessage);
        }
    }
}
