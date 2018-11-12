using FluentAssertions;
using System;
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

        [Theory]
        [InlineData(3, -1, 1, null, 2, 4, new[] { 1, 2, 3 })]
        [InlineData(3, 1, 1, null, 2, 4, new[] { 1, 2, 3 })]
        [InlineData(3, 2, 2, 1, 3, 4, new[] { 4, 5, 6 })]
        [InlineData(3, 3, 3, 2, 4, 4, new[] { 7, 8, 9 })]
        [InlineData(3, 4, 4, 3, null, 4, new[] { 10 })]
        [InlineData(4, 3, 3, 2, null, 3, new[] { 9, 10 })]
        [InlineData(4, 6, 3, 2, null, 3, new[] { 9, 10 })]
        public void GenerateExpectedPagedData(
            int pageSize,
            int page,
            int expectedPage,
            int? expectedPreviousPage,
            int? expectedNextPage,
            int expectedLastPage,
            int[] expectedData)
        {

            var sut = Paged<int>.Generate(data, pageSize, page);

            sut.Data.Count().Should().Be(expectedData.Length);
            sut.Page.Should().Be(expectedPage);
            sut.Total.Should().Be(data.LongCount());
            sut.Data.Should().Contain(expectedData);
            sut.PreviousPage.Should().Be(expectedPreviousPage);
            sut.NextPage.Should().Be(expectedNextPage);
            sut.LastPage.Should().Be(expectedLastPage);
            sut.PageSize.Should().Be(expectedData.Length);
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
