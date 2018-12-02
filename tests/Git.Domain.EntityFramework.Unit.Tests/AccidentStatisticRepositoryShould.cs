using FluentAssertions;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ApprovalTests;
using ApprovalTests.Reporters;
using Git.Domain.Models.TFL;
using Xunit;

using static Git.Domain.EntityFramework.SortOption<Git.Domain.EntityFramework.Models.AccidentStatisticDb>;

namespace Git.Domain.EntityFramework.Unit.Tests
{
    [UseReporter(typeof(DiffReporter))]
    public class AccidentStatisticRepositoryShould : IDisposable
    {
        private readonly IAccidentStatisticDbContext _accidentStatisticDbContext;
        private readonly AccidentStatisticRepository _subject;

        public AccidentStatisticRepositoryShould()
        {
            _accidentStatisticDbContext = new AccidentStatisticDbContext();
            _subject = new AccidentStatisticRepository(_accidentStatisticDbContext);
            int actualCount = _accidentStatisticDbContext.AccidentStatistics.Count();
            if (actualCount != 0) return;            
            do
            {
                Thread.Sleep(10000);
            } while (!_accidentStatisticDbContext.AccidentStatistics.Any());
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
        public void GetAListOfFilteredByFatalCyclingAccidentsAndSortedByIdAscending()
        {
            var actual = _subject.Get(filter => 
                    filter.Severity == Severity.Fatal &&
                    filter.Casualties.Any(casualty =>
                        casualty.Mode.Equals("PedalCycle") && 
                        casualty.Severity == Severity.Fatal), 
                    OrderBy(x => x.AccidentStatisticId, true))
                .GetAwaiter()
                .GetResult();

            Approvals.VerifyJson(actual.ToJson());
        }

        [Fact]
        public void GetAListOfFilteredByFatalCyclingAccidentsAndSortedByIdDescending()
        {
            var actual = _subject.Get(filter =>
                    filter.Severity == Severity.Fatal &&
                    filter.Casualties.Any(casualty =>
                        casualty.Mode.Equals("PedalCycle") &&
                        casualty.Severity == Severity.Fatal),
                        OrderBy(x => x.AccidentStatisticId, false))
                    .GetAwaiter()
                    .GetResult();

            Approvals.VerifyJson(actual.ToJson());
        }

        [Fact]
        public void GetAListOfFilteredByFatalCyclingAccidentsAndSortedByIdDescendingAndOnlyReturnPage1Of1()
        {
            var actual = _subject.Get(filter =>
                    filter.Severity == Severity.Fatal &&
                    filter.Casualties.Any(casualty =>
                        casualty.Mode.Equals("PedalCycle") &&
                        casualty.Severity == Severity.Fatal), 
                    OrderBy(x => x.AccidentStatisticId, false),
                    1, 
                    1)
                .GetAwaiter()
                .GetResult();

            Approvals.VerifyJson(actual.ToJson());
        }


        [Fact]
        public void GetAListOfFilteredByFatalCyclingAccidentsAndSortedByIdDescendingAndOnlyReturnPage2Of1()
        {
            var actual = _subject.Get(filter =>
                    filter.Severity == Severity.Fatal &&
                    filter.Casualties.Any(casualty =>
                        casualty.Mode.Equals("PedalCycle") &&
                        casualty.Severity == Severity.Fatal), 
                    OrderBy(x => x.AccidentStatisticId, false), 
                    2, 
                    1)
                .GetAwaiter()
                .GetResult();

            Approvals.VerifyJson(actual.ToJson());
        }

        [Fact]
        public void GetAListOfFilteredByFatalCyclingAccidentsAndWhenThePageIsHigherThan20ReturnPage20()
        {
            const int AboveTwentyPage = 21;
            var actual = _subject.Get(filter =>
                        filter.Severity == Severity.Fatal &&
                        filter.Casualties.Any(casualty =>
                            casualty.Mode.Equals("PedalCycle") &&
                            casualty.Severity == Severity.Fatal), 
                    OrderBy(x => x.AccidentStatisticId, false), 
                    AboveTwentyPage, 
                    1)
                .GetAwaiter()
                .GetResult();

            Approvals.VerifyJson(actual.ToJson());
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        public void GetAListOfFilteredByFatalCyclingAccidentsAndWhenThePageIsBelowZeroShouldReturnTheFirstPage(
            int invalidPage)
        {
            var actual = _subject.Get(filter =>
                        filter.Severity == Severity.Fatal &&
                        filter.Casualties.Any(casualty =>
                            casualty.Mode.Equals("PedalCycle") &&
                            casualty.Severity == Severity.Fatal), 
                    OrderBy(x => x.AccidentStatisticId, false), 
                    invalidPage, 
                    1)
                .GetAwaiter()
                .GetResult();

            Approvals.VerifyJson(actual.ToJson());
        }

        public void Dispose()
        {
            _accidentStatisticDbContext.Dispose();
        }
    }
}
