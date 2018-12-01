using FluentAssertions;
using System;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Git.Domain.Models.TFL;
using Xunit;

namespace Git.Domain.EntityFramework.Unit.Tests
{
    public class AccidentStatisticRepositoryShould : IDisposable
    {
        private readonly IAccidentStatisticDbContext _accidentStatisticDbContext;
        private readonly AccidentStatisticRepository _subject;

        public AccidentStatisticRepositoryShould()
        {
            _accidentStatisticDbContext = new AccidentStatisticDbContext();
            _subject = new AccidentStatisticRepository(_accidentStatisticDbContext);
            int actualCount = _accidentStatisticDbContext.AccidentStatistics.Count();
            if (actualCount == 0)
            {
                // Hack to let the temp database generate in the background
                // TODO: Come up with a more efficient way of doing this
                do
                {
                    Thread.Sleep(10000);
                } while (!_accidentStatisticDbContext.AccidentStatistics.Any());
            }
        }

        [Fact]
        public async Task ContainDataForThisIntegrationTestToRunSuccessfully()
        {
            var actualCount = await _accidentStatisticDbContext.AccidentStatistics.CountAsync();

            actualCount.Should().BeGreaterThan(0, "If this test fails than there is no database generated yet");
        }

        [Fact]
        public async Task CountAccidentStatistics()
        {
            var actualCount = await _subject.Count();

            actualCount.Should().BeGreaterThan(0);
        }

        [Fact]
        public async Task CountForOneAccidentStatisticWhenFilteringForTheFirstAccident()
        {
            var actualCount = await _subject.Count( x=> x.AccidentStatisticId == 1);

            actualCount.Should().Be(1);
        }

        [Fact]
        public async Task GetAListOfFilteredAccidents()
        {
            var actual = await _subject.Get(filter => 
                    filter.Severity == Severity.Fatal &&
                    filter.Casualties.Any(casualty =>
                        casualty.Mode.Equals("PedalCycle") && 
                        casualty.Severity == Severity.Fatal)
                ,sort => sort.Borough, true);

            actual.Should().NotBeNull();
        }

        public void Dispose()
        {
            _accidentStatisticDbContext.Dispose();
        }
    }
}
