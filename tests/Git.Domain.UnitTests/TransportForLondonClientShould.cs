using System;
using System.Collections.Generic;
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

            await transportForLondonClient.GetAccidentStatistics(2016);

            httpTest.ShouldHaveCalled("https://fake-api.tfl.gov.uk/AccidentStats/2016");
        }

        [Fact]
        public async void ShouldGetFirstPageAccidentStatisticsCorrect()
        {
            var accidentStatistics = autoFixture.CreateMany<AccidentStatistic>();
            httpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await transportForLondonClient.GetPagedAccidentStatistics(2016, 1, 5);

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

            var actual = await transportForLondonClient.GetPagedAccidentStatistics(year: 2016, page:2, pageSize:5);

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

            var actual = await transportForLondonClient.GetPagedAccidentStatistics(year:2016, page:-1, pageSize:5);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(3);
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(5);
        }

        [Fact]
        public async void ShouldFilterAllDataWithFatalSeverity()
        {
            var json = LoadAll2017AccidentTestDataJson();
            var accidentStatistics = JsonConvert.DeserializeObject(json);
            httpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await transportForLondonClient.GetPagedAccidentStatistics(year: 2016, filter: filter => filter.Severity == Severity.Fatal);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(262);
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(100);
        }      

        private static string LoadAll2017AccidentTestDataJson()
        {
            return File.ReadAllText("TestData\\2017AccidentData.json");
        }


        public void Dispose()
        {
            httpTest.Dispose();
        }
    }
}
