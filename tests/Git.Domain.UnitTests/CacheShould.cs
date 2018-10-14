using System;
using System.Threading;
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

            sut.Store(1, "Samuel", TimeSpan.FromSeconds(1));            
            var first = sut.Get(1);
            var second = sut.Get(1);

            object.ReferenceEquals(first, second).Should().BeTrue();
        }

        [Fact]
        public void ShouldExpireCache()
        {
            var sut = new Cache<int, string>();
            sut.Store(2, "Gabriel", TimeSpan.FromSeconds(1));
            var first = sut.Get(2);

            Thread.Sleep(2000);

            var second = sut.Get(2);
            object.ReferenceEquals(first, second).Should().BeFalse();
        }
    }
}
