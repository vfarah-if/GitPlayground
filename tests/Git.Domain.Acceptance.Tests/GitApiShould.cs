using System;
using Xunit;
using FluentAssertions;

namespace Git.Domain.Acceptance.Tests
{
    public class GitApiShould
    {
        private GitApiClient gitApiClient;

        public GitApiShould()
        {
            gitApiClient = new GitApiClient();
        }

        [Fact(Skip = "Not able to get Git to work with Personal Token")]
        public async void GetAllUsers()
        {
            var actual = await gitApiClient.GetAllUsersAsync();

            actual.Should().NotBeNullOrEmpty();
        }
    }
}
