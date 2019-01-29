using FluentAssertions;
using Git.Domain.Models;
using Microsoft.Owin.Testing;
using System;
using System.Linq;
using System.Net;
using Git.Domain;
using Git.Owin.Api.Host;
using Xunit;

namespace Git.Owin.Api.Acceptance.Tests.v2.ApiControllers
{
    public class AccidentsControllerShould : IDisposable
    {
        private readonly TestServer testServer;

        public AccidentsControllerShould()
        {
            testServer = TestServer.Create<ApiStartup>();
        }

        [Fact]
        public async void GetTheFirstPageOfTenFatalAccidentStatisticsFrom2014To2017()
        {
            var result = await testServer.HttpClient.GetAsync($"v2/accidents?from=2014-01-01T00:00:00Z&to=2017-12-31T00:00:00Z&severity=Fatal&page=1&pageSize=10");
            string responseContent = await result.Content.ReadAsStringAsync();
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            var responsePaged = responseContent.To<Paging<AccidentStatistic>>();
            responsePaged.Should().NotBeNull();
            responsePaged.Data.Count().Should().Be(10, "Database may not be seeded");
            responsePaged.PageSize.Should().Be(10);
            responsePaged.Page.Should().Be(1);
            responsePaged.Total.Should().Be(877, "Database may not have been seeded with the expected data");
        }

        [Fact]
        public async void GetTheFirstPageOfSlightAccidentsFromTheVeryBeginningTo2017()
        {
            var result = await testServer.HttpClient.GetAsync($"v2/accidents?from=2005-01-01T00:00:00Z&to=2017-12-31T00:00:00Z&severity=Slight&page=1&pageSize=10");
            string responseContent = await result.Content.ReadAsStringAsync();
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            var responsePaged = responseContent.To<Paging<AccidentStatistic>>();
            responsePaged.Should().NotBeNull();
            responsePaged.Data.Count().Should().Be(10, "Database may not be seeded");
            responsePaged.PageSize.Should().Be(10);
            responsePaged.Page.Should().Be(1);
            responsePaged.Total.Should().Be(541746, "Database may have not been seeded with all the expected data");
        }

        [Fact]
        public async void GetTheFirstPageOfSlightAccidentsFromTheVeryBeginningTo2017UsingSwaggerQueryAttributes()
        {
            var result = await testServer.HttpClient.GetAsync($"v2/accidents?accidentStatisticsQuery.from=2005-01-01T00:00:00Z&accidentStatisticsQuery.to=2017-12-31T00:00:00Z&accidentStatisticsQuery.severity=Slight&accidentStatisticsQuery.page=1&accidentStatisticsQuery.pageSize=10");
            string responseContent = await result.Content.ReadAsStringAsync();
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            var responsePaged = responseContent.To<Paging<AccidentStatistic>>();
            responsePaged.Should().NotBeNull();
            responsePaged.Data.Count().Should().Be(10, "Database may not be seeded");
            responsePaged.PageSize.Should().Be(10);
            responsePaged.Page.Should().Be(1);
            responsePaged.Total.Should().Be(541746, "Database may have not been seeded with all the expected data");
        }

        [Fact]
        public async void GetLastYearsAccidentStatisticsByDefault()
        {
            var result = await testServer.HttpClient.GetAsync($"v2/Accidents");

            string responseContent = await result.Content.ReadAsStringAsync();
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            var responsePaged = responseContent.To<Paging<AccidentStatistic>>();
            if (responsePaged.Total == 131)
            {
                responsePaged.Should().NotBeNull();
                responsePaged.Data.Count().Should().Be(100);
                responsePaged.PageSize.Should().Be(100);
                responsePaged.Page.Should().Be(1);
                responsePaged.Total.Should().Be(131);
            }
            else
            {
                responsePaged.Should().NotBeNull();
                responsePaged.Data.Count().Should().Be(100);
                responsePaged.PageSize.Should().Be(100);
                responsePaged.Page.Should().Be(1);
                responsePaged.Total.Should().Be(262);
            }                       
        }

        [Fact]
        public async void GetBadRequestWhenInvalidDateIsPassedWithAnErrorOccured()
        {
            var result = await testServer.HttpClient.GetAsync($"v2/Accidents?from=InvalidDate");

            string responseContent = await result.Content.ReadAsStringAsync();
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            responseContent.Should().Contain("The request is invalid");
        }

        public void Dispose()
        {
            testServer.Dispose();
        }
    }
}
