
using AutoFixture;
using Git.Domain.Models.TFL;
using Xunit;

namespace Git.Domain.UnitTests
{
    public partial class TransportForLondonClientShould
    {
        public class GetAllAccidentStatisticsShould : TransportForLondonClientShould
        {
            [Fact]
            public async void CallTheAccidentStatisticsUrlFor2016()
            {
                var accidentStatistics = this.AutoFixture.CreateMany<AccidentStatistic>();
                this.HttpTest.RespondWithJson(accidentStatistics, 200);

                await this.TransportForLondonClient.GetAllAccidentStatistics(2016);

                this.HttpTest.ShouldHaveCalled("https://fake-api.tfl.gov.uk/AccidentStats/2016");
            }
        }
    }
}