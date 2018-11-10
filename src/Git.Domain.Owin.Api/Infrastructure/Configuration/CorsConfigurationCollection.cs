using System.Collections.Generic;
using System.Configuration;

namespace Git.Domain.Owin.Api.Infrastructure.Configuration
{
    [ConfigurationCollection(typeof(CorsConfigurationElement))]
    public class CorsConfigurationCollection : ConfigurationElementCollection, IEnumerable<CorsConfigurationElement>
    {
        protected override ConfigurationElement CreateNewElement()
        {
            return new CorsConfigurationElement();
        }

        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((CorsConfigurationElement)element).AllowedOrigin;
        }

        public new IEnumerator<CorsConfigurationElement> GetEnumerator()
        {
            foreach (var key in BaseGetAllKeys())
            {
                yield return (CorsConfigurationElement)BaseGet(key);
            }
        }
    }
}
