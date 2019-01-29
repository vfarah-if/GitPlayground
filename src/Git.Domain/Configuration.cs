using System;
using System.Configuration;

namespace Git.Domain
{
    public class Configuration : IConfiguration
    {
        protected Configuration()
        {
        }

        public string TransportForLondonBaseUrl => ConfigurationManager.AppSettings["TFLApiBaseUrl"] ?? "https://api.tfl.gov.uk";
        public TimeSpan CacheExpirationTimeInMinutes => TimeSpan.FromMinutes(ConfigurationManager.AppSettings["CacheTimeInMinutes"].ToMinutes());
        public int MaximumYear => Convert.ToInt32(ConfigurationManager.AppSettings["MaximumYear"] ?? "2017");

        public static Configuration Create()
        {
            return new Configuration();
        }
    }
}
