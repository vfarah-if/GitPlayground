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
            using (WebApp.Start<DefaultOwinConfiguration>(url: baseAddress))
            {
                Trace.TraceInformation($"Started hosting on {baseAddress}");
                Console.ReadLine();
            }
        }
    }
}
