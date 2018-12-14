
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
                var accidentStatistics = AutoFixture.CreateMany<AccidentStatistic>();
                HttpTest.RespondWithJson(accidentStatistics, 200);

                await TransportForLondonClient.GetAllAccidentStatistics(2016);

                HttpTest.ShouldHaveCalled("https://fake-api.tfl.gov.uk/AccidentStats/2016");
            }
        }
    }
}