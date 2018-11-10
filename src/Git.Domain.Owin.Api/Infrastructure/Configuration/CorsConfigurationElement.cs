using System.Configuration;
using System.Diagnostics.CodeAnalysis;

namespace Git.Domain.Owin.Api.Infrastructure.Configuration
{
    [ExcludeFromCodeCoverage]
    public class CorsConfigurationElement : ConfigurationElement
    {
        private const string AllowedOriginProp = "allowedOrigin";

        [ConfigurationProperty(AllowedOriginProp, DefaultValue = "", IsRequired = true)]
        public string AllowedOrigin
        {
            get { return (string) this[AllowedOriginProp]; }
            set { this[AllowedOriginProp] = value; }
        }
    }
}