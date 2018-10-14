using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Flurl.Http;
using Git.Domain.Models.TFL;
using TestStack.BDDfy;
using Xunit;

namespace Git.Domain.Acceptance.Tests
{
    public class TransportForLondonClientShould
    {
        private readonly TransportForLondonClient transportForLondonClient;
        private IReadOnlyList<AccidentStatistic> accidentStatistics;

        public TransportForLondonClientShould()
        {
            transportForLondonClient = new TransportForLondonClient();
        }

        [Fact]
        public async void GetAccidentStatisticsDynamicFor2017()
        {
            var actual = await transportForLondonClient.GetAccidentStatisticsAsDynamic(2017);

            actual.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async void GetAccidentStatisticsFor2017()
        {
            var actual = await transportForLondonClient.GetAccidentStatistics(2017);

            actual.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async void GetAccidentStatisticsFor2017WithFilter()
        {
            var actual = await transportForLondonClient.GetAccidentStatistics(2017, each => each.Severity == Severity.Fatal);

            actual.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async void GetFirstPagedAccidentStatisticsFor2017()
        {
            var actual = await transportForLondonClient.GetPagedAccidentStatistics(2017, 1, 100);

            actual.Should().NotBeNull();
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(100);
            actual.Data.Count().Should().Be(100);
            actual.Total.Should().Be(54178);
        }

        [Fact]
        public async void GetFirstPagedAccidentStatisticsFor2017_WhenPageLessThanOrEqualToZero()
        {
            var actual = await transportForLondonClient.GetPagedAccidentStatistics(2017, 0, 100);

            actual.Should().NotBeNull();
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(100);
            actual.Data.Count().Should().Be(100);
            actual.Total.Should().Be(54178);
        }

        [Fact]
        public async void GetLastPagedAccidentStatisticsFor2017()
        {
            var actual = await transportForLondonClient.GetPagedAccidentStatistics(2017, 542, 100);

            actual.Should().NotBeNull();
            actual.Page.Should().Be(542);
            actual.PageSize.Should().Be(100);
            actual.Data.Count().Should().Be(78);
            actual.Total.Should().Be(54178);
        }

        [Fact]
        public async void GetPagedHigherThanMaxAccidentStatisticsFor2017ShouldGoToTheMax()
        {
            var actual = await transportForLondonClient.GetPagedAccidentStatistics(2017, 543, 100);

            actual.Should().NotBeNull();
            actual.Page.Should().Be(542);
            actual.PageSize.Should().Be(100);
            actual.Data.Count().Should().Be(78);
            actual.Total.Should().Be(54178);
        }

        [Fact]
        public void Get_accident_statistics_for_2017()
        {
            this.Given(_ => _.GivenIGetAccidentStatisticsFor2017())
                .Then(_ => _.ThenAccidentStatisticsShouldNotBeNullOrEmpty())
                .BDDfy();
        }

        [Fact]
        public void ThrowAFlurlHttpExceptionForCurrentYearStatistics()
        {
            Func<Task> action = async () => await transportForLondonClient.GetAccidentStatistics(DateTime.Today.Year);

            action.Should()
            .Throw<FlurlHttpException>()
            .WithMessage($"Call failed with status code 400 (Bad Request): GET https://api.tfl.gov.uk/AccidentStats/{DateTime.Today.Year}");
        }


        private async void GivenIGetAccidentStatisticsFor2017()
        {
            accidentStatistics = await transportForLondonClient.GetAccidentStatistics(2017)
                .ConfigureAwait(false);
        }

        private void ThenAccidentStatisticsShouldNotBeNullOrEmpty()
        {
            accidentStatistics.Should().NotBeNullOrEmpty();
        }
    }
}

