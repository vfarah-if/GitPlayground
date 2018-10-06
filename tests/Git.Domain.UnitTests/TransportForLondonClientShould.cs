using System;
using AutoFixture;
using Flurl.Http.Testing;
using Git.Domain.Models.TFL;
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

        public void Dispose()
        {
            httpTest.Dispose();
        }
    }
}
