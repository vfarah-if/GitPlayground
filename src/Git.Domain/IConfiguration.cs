namespace Git.Domain
{
    using System;

    public interface IConfiguration
    {
        string TransportForLondonBaseUrl { get; }

        TimeSpan CacheExpirationTimeInMinutes { get; }
        
        int MaximumYear { get; }
    }
}