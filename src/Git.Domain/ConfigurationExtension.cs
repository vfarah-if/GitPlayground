using System;

namespace Git.Domain
{
    public static class ConfigurationExtension
    {
        public static double ToMinutes(this string minutesAsString)
        {
            if (!string.IsNullOrEmpty(minutesAsString))
            {
                return Convert.ToDouble(minutesAsString);
            }

            return default(int);
        }
    }
}
