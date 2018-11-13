using AutoFixture;
using Flurl.Http.Testing;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Net.Http;

namespace Git.Domain.UnitTests
{
    public partial class TransportForLondonClientShould : IDisposable
    {
        protected readonly HttpTest HttpTest;

        protected readonly TransportForLondonClient TransportForLondonClient;

        protected readonly Fixture AutoFixture;

        public TransportForLondonClientShould()
        {
            this.HttpTest = new HttpTest();
            this.TransportForLondonClient = new TransportForLondonClient(Configuration.Create());
            this.AutoFixture = new Fixture();
        }

        protected static HttpResponseMessage CreateHttpResponseMessage(string content, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            return new HttpResponseMessage(statusCode) { Content = new StringContent(content) };
        }

        protected static object LoadAll2017AccidentTestData()
        {
            var json = Get2017AccidentData();
            return JsonConvert.DeserializeObject(json);
        }

        protected static string Get2017AccidentData()
        {
            return File.ReadAllText("TestData\\test2017.json");
        }

        public void Dispose()
        {
            this.HttpTest.Dispose();
        }
    }
}