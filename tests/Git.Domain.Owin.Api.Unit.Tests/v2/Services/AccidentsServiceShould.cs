using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AutoFixture;
using FluentAssertions;
using Git.Domain.EntityFramework;
using Git.Domain.EntityFramework.Models;
using Git.Domain.Owin.Api.Models;
using Git.Domain.Owin.Api.v2.Services;
using Moq;
using Moq.AutoMock;
using Xunit;

namespace Git.Domain.Owin.Api.Unit.Tests.v2.Services
{
    public class AccidentsServiceShould
    {
        private readonly AutoMocker _mocker;
        private readonly Fixture _autoFixture;
        private readonly AccidentsService _subject;
        private readonly Mock<IAccidentStatisticRepository> _repositoryMock;
        private Paged<AccidentStatisticDb> _pagedResult;

        public AccidentsServiceShould()
        {
             _mocker = new AutoMocker();
            _autoFixture = new Fixture();
            _autoFixture.Behaviors
                .OfType<ThrowingRecursionBehavior>()
                .ToList().ForEach(b => _autoFixture.Behaviors.Remove(b));
            _autoFixture.Behaviors.Add(new OmitOnRecursionBehavior(1));
            _subject = _mocker.CreateInstance<AccidentsService>();
            _repositoryMock = _mocker.GetMock<IAccidentStatisticRepository>();
            _pagedResult = _autoFixture.Create<Paged<AccidentStatisticDb>>();
            _repositoryMock.Setup(x => x.Get(
                    It.IsAny<Expression<Func<AccidentStatisticDb, bool>>>(), 
                    It.IsAny<EntityFramework.SortOptions<AccidentStatisticDb>>(), 
                    It.IsAny<int>(), 
                    It.IsAny<int>()))
                .ReturnsAsync(() => _pagedResult);
        }

        [Fact]
        public void ThrowNullArgumentExceptionWhenAssignedANullValue()
        {
            Func<Task> action = async () => await _subject.GetAccidents(null).ConfigureAwait(false);

            action.Should().Throw<ArgumentNullException>();
        }

        [Fact]
        public async Task VerifyAccidentStatisticsCallTheUnderlyingRepositoryToGetData()
        {
            var accidentStatisticsQuery = CreateAccidentStatisticsQuery(
                @from: _autoFixture.Create<DateTime>(), 
                to: _autoFixture.Create<DateTime>(), 
                severity: "serious", 
                sortBy: "DATEAscending", 
                page: _autoFixture.Create<int>(), 
                pageSize: _autoFixture.Create<int>());

            await _subject.GetAccidents(accidentStatisticsQuery).ConfigureAwait(false);

            _repositoryMock.Verify(x => x.Get(
                It.Is<Expression<Func<AccidentStatisticDb, bool>>>(y => IsFilterAsExpected(accidentStatisticsQuery, y)),
                It.IsAny<EntityFramework.SortOptions<AccidentStatisticDb>>(),
                accidentStatisticsQuery.Page,
                accidentStatisticsQuery.PageSize));
        }

        private bool IsFilterAsExpected(AccidentStatisticsQuery accidentStatisticsQuery, 
            Expression<Func<AccidentStatisticDb, bool>> actualFilter)
        {
            //            Expression<Func<AccidentStatisticDb, bool>> expectedFilter = filter =>
            //                filter.Date >= accidentStatisticsQuery.From &&
            //                filter.Date <= accidentStatisticsQuery.To &&
            //                filter.Severity == Severity.Serious;
            //             TODO: Investigate how to create a lambda comparer
            //             e.g. https://stackoverflow.com/questions/283537/most-efficient-way-to-test-equality-of-lambda-expressions
            //             var isEqual = LambdaCompare.ShouldEqual(expectedFilter, actualFilter);
            return actualFilter != null;
        }

        private AccidentStatisticsQuery CreateAccidentStatisticsQuery(DateTime @from, DateTime to, string severity,
            string sortBy, int page, int pageSize)
        {
            return _autoFixture.Build<AccidentStatisticsQuery>()
                .With(x => x.From, from)
                .With(x => x.To, to)
                .With(x => x.Severity, severity)
                .With(x => x.SortBy, sortBy)
                .With(x => x.Page, page)
                .With(x => x.PageSize, pageSize)
                .Create();
        }
    }
}
