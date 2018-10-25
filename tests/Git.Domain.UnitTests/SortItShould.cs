using System;
using System.Collections.Generic;
using AutoFixture;
using FluentAssertions;
using Xunit;

namespace Git.Domain.UnitTests
{
    public class SortItShould
    {
        private Fixture autoFixture;
        private readonly DateTime ExactDateTime = new DateTime(2018, 01, 01, 01, 01, 01);

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

            //Default sort

            items[0].StringField.Should().Be("aaaa");
            items[1].StringField.Should().Be("bbbb");
            items[2].StringField.Should().Be("cccc");

            // Reverse default sort
            items.Sort((x, y) => stringSort.Compare(y, x));

            items[0].StringField.Should().Be("cccc");
            items[1].StringField.Should().Be("bbbb");
            items[2].StringField.Should().Be("aaaa");
        }

        [Fact]
        public void SortIntegersByDefaultComparer()
        {
            var items = CreateTestAllSortsList();

            IComparer<TestAllSorts> intSort = SortIt<TestAllSorts>.With(sortField => sortField.IntegerField);

            //Default sort
            items.Sort(intSort);

            items[0].IntegerField.Should().Be(1);
            items[1].IntegerField.Should().Be(2);
            items[2].IntegerField.Should().Be(3);

            // Reverse default sort
            items.Sort((x, y) => intSort.Compare(y, x));

            items[0].IntegerField.Should().Be(3);
            items[1].IntegerField.Should().Be(2);
            items[2].IntegerField.Should().Be(1);
        }

        [Fact]
        public void SortDateTimesByDefaultComparer()
        {
            var items = CreateTestAllSortsList();

            IComparer<TestAllSorts> dateSort = SortIt<TestAllSorts>.With(sortField => sortField.DateTimeField);

            //Default sort
            items.Sort(dateSort);

            items[0].DateTimeField.Should().Be(DateTime.MinValue);
            items[1].DateTimeField.Should().Be(ExactDateTime);
            items[2].DateTimeField.Should().Be(DateTime.MaxValue);

            // Reverse default sort
            items.Sort((x, y) => dateSort.Compare(y, x));

            items[0].DateTimeField.Should().Be(DateTime.MaxValue);
            items[1].DateTimeField.Should().Be(ExactDateTime);
            items[2].DateTimeField.Should().Be(DateTime.MinValue);
        }

        private List<TestAllSorts> CreateTestAllSortsList()
        {
            var items = new List<TestAllSorts>
            {
                new TestAllSorts()
                {
                    StringField = "cccc",
                    IntegerField = 3,
                    DateTimeField = ExactDateTime
                },
                new TestAllSorts()
                {
                    StringField = "bbbb",
                    IntegerField = 2,
                    DateTimeField = DateTime.MinValue
                },
                new TestAllSorts()
                {
                    StringField = "aaaa",
                    IntegerField = 1,
                    DateTimeField = DateTime.MaxValue
                }
            };
            return items;
        }
    }

    internal class TestAllSorts
    {
        public string StringField { get; set; }
        public int IntegerField { get; set; }
        public DateTime DateTimeField { get; set; }
    }
}
