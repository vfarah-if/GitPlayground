using System;
using System.Collections.Generic;
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

