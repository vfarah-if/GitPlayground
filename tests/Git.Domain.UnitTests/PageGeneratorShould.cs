using AutoFixture;
using FluentAssertions;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace Git.Domain.UnitTests
{
    public class PageGeneratorShould
    {
        private readonly Fixture autoFixture;

        private IEnumerable<int> data;

        public PageGeneratorShould()
        {
            this.data = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        }

        [Fact]
        public void GetFirstPageWithPageSizeOfThree()
        {
            var pageSize = 3;
            var page = 1;

            var sut = Paged<int>.Generate(this.data.ToList().AsReadOnly(), pageSize, page);

            sut.Data.LongCount().Should().Be(pageSize);
            sut.Page.Should().Be(page);
            sut.Total.Should().Be(this.data.LongCount());
            sut.Data.Should().Contain(new[] { 1, 2, 3 });
        }

        [Fact]
        public void GetBelowFirstPageWithPageSizeOfThreeWillDefaultToFistPage()
        {
            var pageSize = 3;
            var page = 1;

            var sut = Paged<int>.Generate(this.data.ToList().AsReadOnly(), pageSize, -1);

            sut.Data.LongCount().Should().Be(pageSize);
            sut.Page.Should().Be(page);
            sut.Total.Should().Be(this.data.LongCount());
            sut.Data.Should().Contain(new[] { 1, 2, 3 });
        }

        [Fact]
        public void GetLastPageWithPageSizeOfThree()
        {
            var pageSize = 4;
            var page = 3;
            var expectDataCount = 2;

            var sut = Paged<int>.Generate(this.data.ToList().AsReadOnly(), pageSize, page);

            sut.Data.LongCount().Should().Be(expectDataCount);
            sut.Page.Should().Be(page);
            sut.Total.Should().Be(this.data.LongCount());
            sut.Data.Should().Contain(new[] { 9, 10 });
        }

        [Fact]
        public void GetHigherThanMaximumPageWithPageSizeOfThreeWillDefaultToLastPage()
        {
            var pageSize = 4;
            var page = 3;
            var expectDataCount = 2;

            var sut = Paged<int>.Generate(this.data.ToList().AsReadOnly(), pageSize, 6);

            sut.Data.LongCount().Should().Be(expectDataCount);
            sut.Page.Should().Be(page);
            sut.Total.Should().Be(this.data.LongCount());
            sut.Data.Should().Contain(new[] { 9, 10 });
        }
    }
}
