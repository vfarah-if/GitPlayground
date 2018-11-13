using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using Git.Domain;
using Git.Domain.Models.TFL;
using Moq;
using Moq.AutoMock;
using Xunit;
using static Git.Domain.Constants.AccidentStatisticSorting;

namespace TestConsole.UnitTests
{
    public class ApplicationCommandShould
    {
        private readonly AutoMocker autoMocker;
        private readonly ApplicationCommand subject;
        private readonly Paged<AccidentStatistic> pagedAccidentResponse;
        private readonly Mock<ITransportForLondonClient> transportForLondonClientMock;
        private readonly Fixture autoFixture;
        private readonly Mock<ILogger> loggerMock;

        public ApplicationCommandShould()
        {
            autoMocker = new AutoMocker();
            autoFixture = new Fixture();
            subject = autoMocker.CreateInstance<ApplicationCommand>();
            var data = autoFixture.CreateMany<AccidentStatistic>();
            pagedAccidentResponse = CreatePagedAccidentStatistic(data, 1, 20);
            transportForLondonClientMock = autoMocker.GetMock<ITransportForLondonClient>();
            transportForLondonClientMock.Setup(x => x.GetAccidentStatistics(
                It.IsAny<DateTime>(), It.IsAny<DateTime>(), It.IsAny<Severity>(),
                It.IsAny<SortOptions<AccidentStatistic>>(), It.IsAny<int>(), It.IsAny<int>()))
            .ReturnsAsync(() => pagedAccidentResponse);
            loggerMock = autoMocker.GetMock<ILogger>();
            loggerMock.Setup(x => x.AsInformation(It.IsAny<string>()));
        }
        
        [Fact]
        public void CallTransportForLondonClientToGetFatalAccidentStatisticsForJan2014()
        {
            subject.Execute();

            transportForLondonClientMock.Verify(x => x.GetAccidentStatistics(
                DateTime.Parse("01 January 2014 00:00:00"), 
                DateTime.Parse("31 December 2017 00:00:00"),
                Severity.Fatal,
                ByDateDescending,
                1,
                20));
        }

        [Fact]
        public void LogInformationAboutHowManyFatalAccidentsOccured()
        {
            subject.Execute();

            loggerMock.Verify(x => x.AsInformation($"{pagedAccidentResponse.Total} fatal accidents occured"));
        }

        [Fact]
        public void LogInformationPageInformation()
        {
            subject.Execute();

            loggerMock.Verify(x => x.AsInformation($"Page '{pagedAccidentResponse.Page}' of '{pagedAccidentResponse.LastPage}' pages with {pagedAccidentResponse.PageSize} records"));
        }

        private static Paged<AccidentStatistic> CreatePagedAccidentStatistic(IEnumerable<AccidentStatistic> data, int page = 1, int lastPage = 1)
        {
            return Paged<AccidentStatistic>.Create(data.Count(), data, page, data.Count(), lastPage);
        }
    }
}
