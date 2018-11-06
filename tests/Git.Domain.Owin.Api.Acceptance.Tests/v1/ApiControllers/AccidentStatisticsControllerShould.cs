using System;
using FluentAssertions;
using Git.Domain.Owin.Api.Host;
using Microsoft.Owin.Testing;
using System.Net;
using Xunit;

namespace Git.Domain.Owin.Api.Acceptance.Tests.v1.ApiControllers
{
    // http://www.diwebsity.com/2016/04/14/webapi-integration-tests/
    public class AccidentStatisticsControllerShould : IDisposable
    {
        private readonly TestServer testServer;

        public AccidentStatisticsControllerShould()
        {
            testServer = TestServer.Create<DefaultOwinConfiguration>();
        }

        [Fact]
        public async void GetAccidentStatisticsWhenAssignedValidArguments()
        {
            var result = await testServer.HttpClient.GetAsync($"v1/AccidentStatistics?from=2014-01-01T00:00:00Z&to=2017-12-31T00:00:00Z&severity=Fatal&page=1&pageSize=100");
            string responseContent = await result.Content.ReadAsStringAsync();

            result.StatusCode.Should().Be(HttpStatusCode.OK);
            responseContent.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async void GetBadRequestWhenNoParametersSent()
        {
            var result = await testServer.HttpClient.GetAsync($"v1/AccidentStatistics");
            string responseContent = await result.Content.ReadAsStringAsync();

            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            responseContent.Should().NotBeNullOrEmpty();
        }

        public void Dispose()
        {
            testServer.Dispose();
        }
    }
}
