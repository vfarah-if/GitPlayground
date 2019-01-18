using System.Configuration;
using System.Diagnostics.CodeAnalysis;

namespace Git.Owin.Api.Infrastructure.Configuration
{
    [ExcludeFromCodeCoverage]
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
