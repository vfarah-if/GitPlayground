using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;
using Flurl;
using Flurl.Http;

namespace Git.Domain
{
    public class GitApiClient
    {
        private readonly string baseUrl = ConfigurationManager.AppSettings["GitApiBaseUrl"];
        private readonly string oauthToken = ConfigurationManager.AppSettings["OAuthToken"];

        public GitApiClient()
        {
        }

        public async Task<IList<dynamic>> GetAllUsersAsync()
        {
            var result = await baseUrl
                .AppendPathSegment("users")
                .SetQueryParam("page", 1)
                .EnableCookies()
                .WithHeader("Authorization", $"token {oauthToken}")
                //.WithOAuthBearerToken(oauthToken)
                .GetJsonListAsync()                
                .ConfigureAwait(false);
            return result;
        }
    }
}
