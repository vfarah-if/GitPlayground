using System;
using FluentAssertions;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace Git.Domain.UnitTests
{
    public class PageGeneratorShould
    {
        private readonly IEnumerable<int> data;

        public PageGeneratorShould()
        {
            this.data = new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
        }

        [Fact]
        public void GetFirstPageWithPageSizeOfThree()
        {
            var pageSize = 3;
            var page = 1;

            var sut = Paged<int>.Generate(this.data, pageSize, page);

            sut.Data.LongCount().Should().Be(pageSize);
            sut.Page.Should().Be(page);
            sut.Total.Should().Be(this.data.LongCount());
            sut.Data.Should().Contain(new[] { 1, 2, 3 });
            sut.NextPage.HasValue.Should().BeTrue();
            sut.NextPage.Should().Be(2);
            sut.PreviousPage.HasValue.Should().BeFalse();
        }

        [Fact]
        public void GetBelowFirstPageWithPageSizeOfThreeWillDefaultToFistPage()
        {
            var pageSize = 3;
            var page = -1;
            var expectedPage = 1;

            var sut = Paged<int>.Generate(this.data, pageSize, page);

            sut.Data.LongCount().Should().Be(pageSize);
            sut.Page.Should().Be(expectedPage);
            sut.Total.Should().Be(this.data.LongCount());
            sut.Data.Should().Contain(new[] { 1, 2, 3 });
            sut.NextPage.HasValue.Should().BeTrue();
            sut.NextPage.Should().Be(2);
            sut.PreviousPage.HasValue.Should().BeFalse();
        }

        [Fact]
        public void GetLastPageWithPageSizeOfThree()
        {
            var pageSize = 4;
            var page = 3;
            var expectDataCount = 2;

            var sut = Paged<int>.Generate(this.data, pageSize, page);

            sut.Data.LongCount().Should().Be(expectDataCount);
            sut.Page.Should().Be(page);
            sut.Total.Should().Be(this.data.LongCount());
            sut.Data.Should().Contain(new[] { 9, 10 });
            sut.PreviousPage.HasValue.Should().BeTrue();
            sut.PreviousPage.Should().Be(2);
            sut.NextPage.HasValue.Should().BeFalse();
        }

        [Fact]
        public void GetHigherThanMaximumPageWithPageSizeOfThreeWillDefaultToLastPage()
        {
            var pageSize = 4;
            var page = 6;
            var expectDataCount = 2;
            var expctedPage = 3;

            var sut = Paged<int>.Generate(this.data, pageSize, page);

            sut.Data.LongCount().Should().Be(expectDataCount);
            sut.Page.Should().Be(expctedPage);
            sut.Total.Should().Be(this.data.LongCount());
            sut.Data.Should().Contain(new[] { 9, 10 });
            sut.PreviousPage.HasValue.Should().BeTrue();
            sut.PreviousPage.Should().Be(2);
            sut.NextPage.HasValue.Should().BeFalse();
        }

        [Fact]
        public void GetPagedDataForEmptyList()
        {
            var pageSize = 4;
            var page = 1;
            var expectDataCount = 0;
            var expectedPage = 1;
            var emptyList = new List<int>();

            var sut = Paged<int>.Generate(emptyList, pageSize, page);

            sut.Data.LongCount().Should().Be(expectDataCount);
            sut.Page.Should().Be(expectedPage);
            sut.Total.Should().Be(0);
            sut.Data.Should().BeEmpty();
            sut.PreviousPage.HasValue.Should().BeFalse();
            sut.NextPage.HasValue.Should().BeFalse();
        }

        [Fact]
        public void ThrowArgumentNullExceptionForNullData()
        {
            Action testAction = () => Paged<int>.Generate(null, 10, 1);

            testAction.Should().Throw<ArgumentNullException>();
        }
    }
}
