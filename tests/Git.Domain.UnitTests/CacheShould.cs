using System;
using FluentAssertions;
using Xunit;

namespace Git.Domain.UnitTests
{
    public class CacheShould
    {
        [Fact]
        public void StoreAndGetFromCache()
        {
            var sut = new Cache<int, string>();

            sut.Store(1, "One", TimeSpan.FromMinutes(1));

            sut.Get(1).Should().Be("One");
            sut.Get(1).Should().Be("One");
        }

        [Fact]
        public void ShouldExpireCache()
        {
            var sut = new Cache<int, string>();

            sut.Store(1, "One", TimeSpan.Zero);

            sut.Get(1).Should().BeNullOrEmpty();
        }
    }
}
