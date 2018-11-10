using System.Configuration;

namespace Git.Domain.Owin.Api.Infrastructure.Configuration
{
    public class CorsConfiguration : ConfigurationSection
    {
        public const string SectionName = "corsConfiguration";

        public static CorsConfiguration GetSection()
        {
            return (CorsConfiguration)ConfigurationManager.GetSection(SectionName);
        }

        [ConfigurationProperty("corsConfigs", IsDefaultCollection = false)]
        public CorsConfigurationCollection CorsConfigs => (CorsConfigurationCollection)base["corsConfigs"];
    }
}
