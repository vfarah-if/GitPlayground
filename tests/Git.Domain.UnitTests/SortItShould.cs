using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Xunit;

namespace Git.Domain.UnitTests
{
    public class SortItShould
    {
        private Fixture autoFixture;

        public SortItShould()
        {
            autoFixture = new Fixture();
        }

        [Fact]
        public void SortStringsByDefaultComparer()
        {
            var items = CreateTestAllSortsList();

            SortIt<TestAllSorts, string> stringSort = SortIt<TestAllSorts>.With(sortField => sortField.StringField);

            items.Sort(stringSort);

            items[0].StringField.Should().Be("aaaa");
            items[1].StringField.Should().Be("bbbb");
            items[2].StringField.Should().Be("cccc");
        }

        [Fact]
        public void SortIntegersByDefaultComparer()
        {
            var items = CreateTestAllSortsList();

            SortIt<TestAllSorts, int> intSort = SortIt<TestAllSorts>.With(sortField => sortField.IntegerField);

            items.Sort(intSort);

            items[0].IntegerField.Should().Be(1);
            items[1].IntegerField.Should().Be(2);
            items[2].IntegerField.Should().Be(3);
        }

        private List<TestAllSorts> CreateTestAllSortsList()
        {
            var items = new List<TestAllSorts>
            {
                new TestAllSorts()
                {
                    StringField = "cccc",
                    IntegerField = 3
                },
                new TestAllSorts()
                {
                    StringField = "bbbb",
                    IntegerField = 2
                },
                new TestAllSorts()
                {
                    StringField = "aaaa",
                    IntegerField = 1
                }
            };
            return items;
        }
    }

    internal class TestAllSorts
    {
        public string StringField { get; set; }
        public int IntegerField { get; set; }
    }
}
