using System;

namespace Git.Domain
{
    public static class ConfigurationExtension
    {
        public static double ToMinutes(this string source)
        {
            if (!string.IsNullOrEmpty(source))
            {
                return Convert.ToDouble(source);
            }

            return default(int);
        }
    }
}
