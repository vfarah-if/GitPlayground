using System;
using System.Threading.Tasks;
using FluentAssertions;
using Git.Domain.EntityFramework;
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.Models;
using Git.Domain.Owin.Api.v2.Services;
using Xunit;

namespace Git.Domain.Owin.Api.Acceptance.Tests.v2.Services
{
    public class AccidentsServiceShould: IDisposable
    {
        private readonly AccidentStatisticDbContext _dbContext;
        private readonly AccidentStatisticRepository _repository;
        private readonly AccidentsService _subject;

        public AccidentsServiceShould()
        {
            _dbContext = new AccidentStatisticDbContext();
            _repository = new AccidentStatisticRepository(_dbContext);
            _subject = new AccidentsService(_repository);
        }

        [Fact]
        public async Task GetSeriousAccidentsWithLocationAscending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery = 
                CreateQuery(severity: "serious", sortBy: "locationAscending");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Serious);
            actual.Data.Should().BeInAscendingOrder(x => x.Location);
        }

        [Fact]
        public async Task GetSeriousAccidentsWithLocationDescending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery = 
                CreateQuery(severity: "sEriOus", sortBy: "lOcationDescending");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Serious);
            actual.Data.Should().BeInDescendingOrder(x => x.Location);
        }

        [Fact]
        public async Task GetSlightAccidentsWithBoroughAscending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery = 
                CreateQuery(severity: "SlighT", sortBy: "boroughascendinG");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Slight);
            actual.Data.Should().BeInAscendingOrder(x => x.Borough);
        }

        [Fact]
        public async Task GetSlightAccidentsWithBoroughDescending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery = 
                CreateQuery(severity: "SlighT", sortBy: "boroughDescending");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Slight);
            actual.Data.Should().BeInAscendingOrder(x => x.Borough);
        }

        [Fact]
        public async Task GetFatalAccidentsWithAccidentStatisticIdAscending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery = 
                CreateQuery(severity: "FaTaL", sortBy: "accidentStatisticIdAscending");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Fatal);
            actual.Data.Should().BeInAscendingOrder(x => x.AccidentStatisticId);
        }

        [Fact]
        public async Task GetFatalAccidentsWithAccidentStatisticIdDescending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery 
                = CreateQuery(severity: "FaTaL", sortBy: "accidentStatisticIdDescending");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Fatal);
            actual.Data.Should().BeInDescendingOrder(x => x.AccidentStatisticId);
        }

        [Fact]
        public async Task GetFatalAccidentsWithTflIdAscending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery 
                = CreateQuery(severity: "FaTaL", sortBy: "TflIdAscending");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Fatal);
            actual.Data.Should().BeInAscendingOrder(x => x.TflId);
        }

        [Fact]
        public async Task GetFatalAccidentsWithTflIdDescending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery 
                = CreateQuery(severity: "FaTaL", sortBy: "TflIdDescending");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Fatal);
            actual.Data.Should().BeInDescendingOrder(x => x.TflId);
        }

        [Fact]
        public async Task GetFatalAccidentsWithDateAscending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery 
                = CreateQuery(severity: "FaTaL", sortBy: "DateAscending");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Fatal);
            actual.Data.Should().BeInAscendingOrder(x => x.Date);
        }

        [Fact]
        public async Task GetFatalAccidentsWithDateDescending()
        {
            AccidentStatisticsQuery accidentStatisticsQuery 
                = CreateQuery(severity: "FaTaL", sortBy: "DateDescending");

            var actual = await _subject.GetAccidents(accidentStatisticsQuery);

            actual.Data.Should().OnlyContain(x => x.Severity == Severity.Fatal);
            actual.Data.Should().BeInDescendingOrder(x => x.Date);
        }

        private AccidentStatisticsQuery CreateQuery(string severity, string sortBy)
        {
            return new AccidentStatisticsQuery
            {
                From = new DateTime(2017, 01, 01),
                To = new DateTime(2017, 12, 31),
                Severity = severity,
                Page = 1,
                PageSize = 10,
                SortBy = sortBy
            };
        }

        public void Dispose()
        {
            _dbContext.Dispose();
        }
    }
}
