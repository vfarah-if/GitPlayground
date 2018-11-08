using System;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Web.Configuration;
using Git.Domain.Owin.Api.Host;
using Microsoft.Owin.Hosting;

namespace Git.Domain.Owin.Api
{
    [ExcludeFromCodeCoverage]
    class Program
    {
        static void Main(string[] args)
        {
            string baseAddress = WebConfigurationManager.AppSettings["BaseUrl"];
            // Start OWIN host 
            using (WebApp.Start<ApiStartup>(url: baseAddress))
            {
                Trace.TraceInformation($"Started hosting on {baseAddress}");
                Trace.TraceInformation($"Swagger information can be found at {baseAddress}swagger");
                Trace.TraceInformation($"Swagger documentation can be found at {baseAddress}swagger/docs/v1");
                Console.ReadLine();
            }
        }
    }
}
