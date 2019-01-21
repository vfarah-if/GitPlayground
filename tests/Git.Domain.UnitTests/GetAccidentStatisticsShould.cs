﻿using AutoFixture;
using FluentAssertions;
using Git.Domain.Models;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

using static Git.Domain.Constants.AccidentStatisticSorting;

namespace Git.Domain.UnitTests
{
    public class GetAccidentStatisticsShould : TransportForLondonClientShould
    {
        [Fact]
        public async void GetFirstPageAccidentStatisticsCorrect()
        {
            var accidentStatistics = AutoFixture.CreateMany<AccidentStatistic>();
            HttpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await TransportForLondonClient.GetAccidentStatistics(2016, 1, 5);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(3);
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(3);
        }

        [Fact]
        public async void GetFirstPageAccidentStatistics_WhenThereIsNoSecondPage()
        {
            var accidentStatistics = AutoFixture.CreateMany<AccidentStatistic>();
            HttpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await TransportForLondonClient.GetAccidentStatistics(year: 2016, page: 2, pageSize: 5);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(3);
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(3);
        }

        [Fact]
        public async void GetFirstPageAccidentStatistics_WhenThePageIsLessThanOne()
        {
            var accidentStatistics = AutoFixture.CreateMany<AccidentStatistic>();
            HttpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await TransportForLondonClient.GetAccidentStatistics(year: 2016, page: -1, pageSize: 5);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(3);
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(3);
        }

        [Fact]
        public async void FilterAllDataWithFatalSeverity()
        {
            var accidentStatistics = LoadAll2017AccidentTestData();
            HttpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await TransportForLondonClient.GetAccidentStatistics(
                 year: 2017,
                 pageSize: 300,
                 filter: filter => filter.Severity == Severity.Fatal);

            actual.Should().NotBeNull();
            actual.Data.Should().NotBeNull();
            actual.Total.Should().Be(262); // And not 54178
            actual.Page.Should().Be(1);
            actual.PageSize.Should().Be(262);
            actual.Data.Count().Should().Be(262);
        }

        [Fact]
        public async void FilterWithFatalSeverityAndSortAllDataByDateAscending()
        {
            var accidentStatistics = LoadAll2017AccidentTestData();
            HttpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await TransportForLondonClient.GetAccidentStatistics(
                             year: 2017,
                             pageSize: 300,
                             filter: filter => filter.Severity == Severity.Fatal,
                             sortOptions: ByDateAscending);

            actual.Data.Count().Should().Be(262);
            actual.Data.First().DateAsString.Should().Be("2017-01-05T09:11:00Z");
            actual.Data.Last().DateAsString.Should().Be("2017-12-29T10:58:00Z");
        }

        [Fact]
        public async void FilterWithFatalSeverityAndSortAllDataByDateDescending()
        {
            var accidentStatistics = LoadAll2017AccidentTestData();
            HttpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await TransportForLondonClient.GetAccidentStatistics(
                             year: 2017,
                             pageSize: 300,
                             filter: filter => filter.Severity == Severity.Fatal,
                             sortOptions: ByDateDescending);

            actual.Data.Count().Should().Be(262);
            actual.Data.First().DateAsString.Should().Be("2017-12-29T10:58:00Z");
            actual.Data.Last().DateAsString.Should().Be("2017-01-05T09:11:00Z");
        }

        [Fact]
        public async void FilterWithFatalSeverityAndDateRangeAndSortDataAscending()
        {
            var accidentStatistics = LoadAll2017AccidentTestData();
            HttpTest.RespondWithJson(accidentStatistics, 200);

            var actual = await TransportForLondonClient.GetAccidentStatistics(
                             year: 2017,
                             pageSize: 300,
                             filter: filter =>
                                 filter.Severity == Severity.Fatal
                                 && filter.Date >= DateTime.Parse("05 January 2017 09:11:00")
                                 && filter.Date <= DateTime.Parse("10 January 2017 16:13:00"),
                             sortOptions: ByDateAscending);

            actual.Total.Should().Be(10);
            actual.Data.Count().Should().Be(10);
            actual.Data.First().DateAsString.Should().Be("2017-01-05T09:11:00Z");
            actual.Data.Last().DateAsString.Should().Be("2017-01-10T16:13:00Z");
        }

        [Fact]
        public async void FilterWithFatalSeverityOverSeveralYearsAscending()
        {
            var accidentStatistics = Get2017AccidentData();
            HttpTest.ResponseQueue.Enqueue(CreateHttpResponseMessage(accidentStatistics));
            HttpTest.ResponseQueue.Enqueue(CreateHttpResponseMessage(accidentStatistics));

            await TransportForLondonClient.GetAccidentStatistics(
                from: DateTime.Parse("01 January 2016 09:11:00"),
                to: DateTime.Parse("01 December 2017 16:13:00"),
                pageSize: 300,
                severity: Severity.Fatal,
                sortOptions: ByDateAscending);

            HttpTest.ShouldHaveCalled("https://fake-api.tfl.gov.uk/AccidentStats/2016");
            HttpTest.ShouldHaveCalled("https://fake-api.tfl.gov.uk/AccidentStats/2017");
        }

        [Fact]
        public async void SwapValuesIfFromDateGreaterThanToDate()
        {
            var accidentStatistics = Get2017AccidentData();
            HttpTest.ResponseQueue.Enqueue(CreateHttpResponseMessage(accidentStatistics));
            HttpTest.ResponseQueue.Enqueue(CreateHttpResponseMessage(accidentStatistics));

            await TransportForLondonClient.GetAccidentStatistics(
                from: DateTime.Parse("01 December 2017 16:13:00"),
                to: DateTime.Parse("01 January 2016 09:11:00"),
                pageSize: 300,
                severity: Severity.Fatal,
                sortOptions: ByDateAscending);

            HttpTest.ShouldHaveCalled("https://fake-api.tfl.gov.uk/AccidentStats/2016");
            HttpTest.ShouldHaveCalled("https://fake-api.tfl.gov.uk/AccidentStats/2017");
        }

        [Fact]
        public void ThrowNotSupportedExceptionWhenFromRangeLessThan2005()
        {
            Func<Task<Paging<AccidentStatistic>>> action = async () =>
                await TransportForLondonClient.GetAccidentStatistics(
                    from: DateTime.Parse("01 December 2004 16:13:00"),
                    to: DateTime.Parse("01 January 2016 09:11:00"),
                    severity: Severity.Fatal,
                    sortOptions: ByDateAscending);

            action.Should().Throw<NotSupportedException>().WithMessage(ErrorMessages.DatesBelow2005NotSupported);
        }

        [Fact]
        public void ThrowNotSupportedExceptionWhenFromOrTooRangeInCurrentYear()
        {
            Func<Task<Paging<AccidentStatistic>>> action = async () =>
                {
                    var yesterday = DateTime.UtcNow.AddDays(-1);
                    return await TransportForLondonClient.GetAccidentStatistics(
                               from: yesterday,
                               to: DateTime.UtcNow,
                               severity: Severity.Fatal,
                               sortOptions: ByDateAscending);
                };

            action.Should().Throw<NotSupportedException>().WithMessage(string.Format(ErrorMessages.DatesFromMaxYearNotSupported, 2017));
        }
    }
}