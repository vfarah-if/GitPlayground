﻿using FluentAssertions;
using Git.Domain.Models;
using Microsoft.Owin.Testing;
using System;
using System.Linq;
using System.Net;
using Git.Domain;
using Git.Owin.Api.Host;
using Xunit;

namespace Git.Owin.Api.Acceptance.Tests.v1.ApiControllers
{
    // http://www.diwebsity.com/2016/04/14/webapi-integration-tests/
    public class AccidentStatisticsControllerShould : IDisposable
    {
        private readonly TestServer testServer;

        public AccidentStatisticsControllerShould()
        {
            testServer = TestServer.Create<ApiStartup>();
        }

        [Fact]
        public async void GetTheFirstPageOfTenFatalAccidentStatisticsFor2014ToNow()
        {
            var result = await testServer.HttpClient.GetAsync($"v1/accidents?from=2014-01-01T00:00:00Z&to=2017-12-31T00:00:00Z&severity=Fatal&page=1&pageSize=10");
            string responseContent = await result.Content.ReadAsStringAsync();
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            var responsePaged = responseContent.To<Paging<AccidentStatistic>>();
            responsePaged.Should().NotBeNull();
            responsePaged.Data.Count().Should().Be(10);
            responsePaged.PageSize.Should().Be(10);
            responsePaged.Page.Should().Be(1);
        }

        [Fact]
        public async void GetLastYearsAccidentStatisticsByDefault()
        {
            var result = await testServer.HttpClient.GetAsync($"v1/accidents");

            string responseContent = await result.Content.ReadAsStringAsync();
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            var responsePaged = responseContent.To<Paging<AccidentStatistic>>();            
            responsePaged.Should().NotBeNull();
            responsePaged.Data.Count().Should().Be(100);
            responsePaged.PageSize.Should().Be(100);
            responsePaged.Page.Should().Be(1);
            responsePaged.Total.Should().Be(responsePaged.Total == 131 ? 131 : 262);
        }

        [Fact]
        public async void GetBadRequestWhenInvalidDateIsPassedWithAnErrorOccured()
        {
            var result = await testServer.HttpClient.GetAsync($"v1/accidents?from=InvalidDate");

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
