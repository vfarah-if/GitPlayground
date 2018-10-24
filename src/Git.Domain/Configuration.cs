using System;
using System.Configuration;

namespace Git.Domain
{
    public class Configuration : IConfiguration
    {
        protected Configuration()
        {
        }

        public string TransportForLondonBaseUrl => ConfigurationManager.AppSettings["TFLApiBaseUrl"];

        public TimeSpan CacheExpirationTimeInMinutes => TimeSpan.FromMinutes(ConfigurationManager.AppSettings["CacheTimeInMinutes"].ToMinutes());

        public static Configuration Create()
        {
            return new Configuration();
        }
    }
}
