using System;
using System.IO;
using System.Linq;
using AutoFixture;
using FluentAssertions;
using Flurl.Http.Testing;
using Git.Domain.Models.TFL;
using Newtonsoft.Json;
using Xunit;

namespace Git.Domain.UnitTests
{
    public class TransportForLondonClientShould : IDisposable
    {
        private readonly HttpTest httpTest;
        private readonly TransportForLondonClient transportForLondonClient;
        private readonly Fixture autoFixture;

        public TransportForLondonClientShould()
        {
            httpTest = new HttpTest();
            transportForLondonClient = new TransportForLondonClient();
            autoFixture = new Fixture();
        }

        [Fact]
        public async void CallTheAccidentStatisticsUrlFor2016()
        {
            var accidentStatistics = autoFixture.CreateMany<AccidentStatistic>();
            httpTest.RespondWithJson(accidentStatistics, 200);

            await transportForLondonClient.GetAllAccidentStatistics(2016);

            httpTest.ShouldHaveCalled("https://fake-api.tfl.gov.uk/AccidentStats/2016");
        }

        [Fact]
        public async void ShouldGetFirstPageAccidentStatisticsCorrect()
        {
            var accidentStatistics = autoFixture.CreateMany<AccidentStatistic>();
            httpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await transportForLondonClient.GetAccidentStatistics(2016, 1, 5);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(3);
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(5);
        }


        [Fact]
        public async void ShouldGetFirstPageAccidentStatistics_WhenThereIsNoSecondPage()
        {
            var accidentStatistics = autoFixture.CreateMany<AccidentStatistic>();
            httpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await transportForLondonClient.GetAccidentStatistics(year: 2016, page:2, pageSize:5);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(3);
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(5);
        }

        [Fact]
        public async void ShouldGetFirstPageAccidentStatistics_WhenThePageIsLessThanOne()
        {
            var accidentStatistics = autoFixture.CreateMany<AccidentStatistic>();
            httpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await transportForLondonClient.GetAccidentStatistics(year:2016, page:-1, pageSize:5);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(3);
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(5);
        }

        [Fact]
        public async void ShouldFilterAllDataWithFatalSeverity()
        {
            var accidentStatistics = LoadAll2017AccidentTestData();
            httpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await transportForLondonClient.GetAccidentStatistics(year: 2017, pageSize: 300, filter: filter => filter.Severity == Severity.Fatal);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(262); //And not 54178
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(300);
            actual.Data.Count().Should().Be(262);
        }

        [Fact]
        public async void ShouldFilterWithFatalSeverityAndSortAllDataByDateAscending()
        {
            var accidentStatistics = LoadAll2017AccidentTestData();
            httpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await transportForLondonClient.GetAccidentStatistics(
                year: 2017, 
                pageSize: 300, 
                filter: filter => filter.Severity == Severity.Fatal, 
                sortOptions: new SortOptions<AccidentStatistic>(
                    comparer: SortIt<AccidentStatistic>.With(x => x.Date), 
                    inReverse: false));

            actual.Data.Count().Should().Be(262);
            actual.Data.First().DateAsString.Should().Be("2017-01-05T09:11:00Z");
            actual.Data.Last().DateAsString.Should().Be("2017-12-29T10:58:00Z");
        }

        [Fact]
        public async void ShouldFilterWithFatalSeverityAndSortAllDataByDateDescending()
        {
            var accidentStatistics = LoadAll2017AccidentTestData();
            httpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await transportForLondonClient.GetAccidentStatistics(
                year: 2017,
                pageSize: 300,
                filter: filter => filter.Severity == Severity.Fatal,
                sortOptions: new SortOptions<AccidentStatistic>(
                    comparer: SortIt<AccidentStatistic>.With(x => x.Date), 
                    inReverse:true));

            actual.Data.Count().Should().Be(262);
            actual.Data.First().DateAsString.Should().Be("2017-12-29T10:58:00Z");
            actual.Data.Last().DateAsString.Should().Be("2017-01-05T09:11:00Z");
        }

        [Fact]
        public async void ShouldFilterWithFatalSeverityAndDateRangeAndSortDataAscending()
        {
            var accidentStatistics = LoadAll2017AccidentTestData();
            httpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await transportForLondonClient.GetAccidentStatistics(
                year: 2017,
                pageSize: 300,
                filter: filter => filter.Severity == Severity.Fatal && 
                                  filter.Date >= DateTime.Parse("05 January 2017 09:11:00") && 
                                  filter.Date <= DateTime.Parse("10 January 2017 16:13:00"),
                sortOptions: new SortOptions<AccidentStatistic>(
                    comparer: SortIt<AccidentStatistic>.With(x => x.Date),
                    inReverse: false));

            actual.Total.Should().Be(10);
            actual.Data.Count().Should().Be(10);
            actual.Data.First().DateAsString.Should().Be("2017-01-05T09:11:00Z");
            actual.Data.Last().DateAsString.Should().Be("2017-01-10T16:13:00Z");
        }

        private static object LoadAll2017AccidentTestData()
        {
            var json = File.ReadAllText("TestData\\2017AccidentData.json");
            return JsonConvert.DeserializeObject(json);
        }

        public void Dispose()
        {
            httpTest.Dispose();
        }
    }
}
