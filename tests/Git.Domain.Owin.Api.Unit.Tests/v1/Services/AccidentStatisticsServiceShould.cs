using System;
using System.Threading.Tasks;
using AutoFixture;
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.v1.Models;
using Git.Domain.Owin.Api.v1.Services;
using Moq;
using Moq.AutoMock;
using Xunit;
using static Git.Domain.Constants.AccidentStatisticSorting;

namespace Git.Domain.Owin.Api.Unit.Tests.v1.Services
{
    public class AccidentStatisticsServiceShould
    {
        private readonly AutoMocker _mocker;
        private readonly Fixture _autoFixture;
        private readonly AccidentStatisticsService _subject;
        private readonly Mock<ITransportForLondonClient> _transportForLondonClientMock;
        private Paged<AccidentStatistic> _pagedResult;

        public AccidentStatisticsServiceShould()
        {
             _mocker = new AutoMocker();
            _autoFixture = new Fixture();
            _subject = _mocker.CreateInstance<AccidentStatisticsService>();
            _transportForLondonClientMock = _mocker.GetMock<ITransportForLondonClient>();
            _pagedResult = _autoFixture.Create<Paged<AccidentStatistic>>();
            _transportForLondonClientMock.Setup(x => x.GetAccidentStatistics(
                    It.IsAny<DateTime>(), 
                    It.IsAny<DateTime>(), 
                    It.IsAny<Severity>(),
                    It.IsAny<SortOptions<AccidentStatistic>>(), 
                    It.IsAny<int>(), 
                    It.IsAny<int>()))
                .ReturnsAsync(() => _pagedResult);
        }

        [Fact]
        public async Task VerifyAccidentStatisticsCallTransportForLondonClientWithTheCorrectValues()
        {
            var accidentStatisticsQuery = CreateAccidentStatisticsQuery(
                @from: _autoFixture.Create<DateTime>(), 
                to: _autoFixture.Create<DateTime>(), 
                severity: "serious", 
                sortBy: "DATEAscending", 
                page: _autoFixture.Create<int>(), 
                pageSize: _autoFixture.Create<int>());

            await _subject.GetAccidentStatistics(accidentStatisticsQuery).ConfigureAwait(false);

            _transportForLondonClientMock.Verify(x => x.GetAccidentStatistics(
                accidentStatisticsQuery.From, 
                accidentStatisticsQuery.To, 
                Severity.Serious,
                ByDateAscending,
                accidentStatisticsQuery.Page,
                accidentStatisticsQuery.PageSize));
        }

        private AccidentStatisticsQuery CreateAccidentStatisticsQuery(DateTime @from, DateTime to, string severity,
            string sortBy, int page, int pageSize)
        {
            return _autoFixture.Build<AccidentStatisticsQuery>()
                .With(x => x.From, from)
                .With(x => x.To, to)
                .With(x => x.Severity, severity)
                .With(x => x.SortBy, sortBy)
                .With(x => x.Page, page)
                .With(x => x.PageSize, pageSize)
                .Create();
        }
    }
}
