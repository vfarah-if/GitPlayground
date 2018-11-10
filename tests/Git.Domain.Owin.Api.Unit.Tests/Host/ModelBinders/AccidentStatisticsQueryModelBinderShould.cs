using AutoFixture;
using Git.Domain.Owin.Api.Infrastructure.ModelBinders;
using System;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Metadata;
using System.Web.Http.Metadata.Providers;
using System.Web.Http.ModelBinding;
using System.Web.Http.Routing;
using FluentAssertions;
using Git.Domain.Owin.Api.v1.Models;
using Xunit;

namespace Git.Domain.Owin.Api.Unit.Tests.Host.ModelBinders
{
    public class AccidentStatisticsQueryModelBinderShould
    {
        private readonly Fixture _autoFixture;
        private HttpActionContext _actionContext;
        private ModelBindingContext _modelBindingContext;

        public AccidentStatisticsQueryModelBinderShould()
        {
            _autoFixture = new Fixture();
        }

        [Fact]
        public void BindModelWithSuccessfullyWithAllExpectedValues()
        {
            AccidentStatisticsQueryModelBinder subject = new AccidentStatisticsQueryModelBinder();
            var expectedFromDate = new DateTime(2017,01,01);
            var expectedToDate = new DateTime(2017, 12, 31);
            var expectedSeverity = "Fatal";
            var expectedSortBy = "ByLocationDescending";
            int expectedPage = _autoFixture.Create<int>();
            int expectedPageSize = _autoFixture.Create<int>();
            var url = $"http://localhost:9000/v1/accidentstatistics?from={expectedFromDate.ToString("O")}&to={expectedToDate.ToString("O")}&severity={expectedSeverity}&sortBy={expectedSortBy}&page={expectedPage}&pageSize={expectedPageSize}";
            CreateActionAndBindingContextWith(url);

            var actual = subject.BindModel(_actionContext, _modelBindingContext);

            actual.Should().BeTrue();
            _modelBindingContext.Model.Should().NotBeNull();
            _modelBindingContext.Model.Should().BeOfType<AccidentStatisticsQuery>();
            var actualModel = ((AccidentStatisticsQuery)_modelBindingContext.Model);
            actualModel.From.Should().Be(expectedFromDate);
            actualModel.To.Should().Be(expectedToDate);
            actualModel.Severity.Should().Be(expectedSeverity);
            actualModel.SortBy.Should().Be(expectedSortBy);
            actualModel.Page.Should().Be(expectedPage);
            actualModel.PageSize.Should().Be(expectedPageSize);
        }

        [Fact]
        public void BindModelWithDefaultValuesWhenNoQueryValuesAreSupplied()
        {
            AccidentStatisticsQueryModelBinder subject = new AccidentStatisticsQueryModelBinder();
            var expectedFromDate = new DateTime(2017, 01, 01);
            var expectedToDate = new DateTime(2017, 12, 31);
            var expectedSeverity = "Fatal";
            var expectedSortBy = "ByDateDescending";
            int expectedPage = 1;
            int expectedPageSize = 100;
            var url = $"http://localhost:9000/v1/accidentstatistics";
            CreateActionAndBindingContextWith(url);

            var actual = subject.BindModel(_actionContext, _modelBindingContext);

            actual.Should().BeTrue();
            _modelBindingContext.Model.Should().NotBeNull();
            _modelBindingContext.Model.Should().BeOfType<AccidentStatisticsQuery>();
            var actualModel = ((AccidentStatisticsQuery)_modelBindingContext.Model);
            actualModel.From.Should().Be(expectedFromDate);
            actualModel.To.Should().Be(expectedToDate);
            actualModel.Severity.Should().Be(expectedSeverity);
            actualModel.SortBy.Should().Be(expectedSortBy);
            actualModel.Page.Should().Be(expectedPage);
            actualModel.PageSize.Should().Be(expectedPageSize);
        }

        [Fact]
        public void CreateInvalidModelStateWhenFromDateIsInIncorrectFormat()
        {
            AccidentStatisticsQueryModelBinder subject = new AccidentStatisticsQueryModelBinder();
            var invalidDate = "BadFormat";
            var url = $"http://localhost:9000/v1/accidentstatistics?from={invalidDate}";
            CreateActionAndBindingContextWith(url);

            var actual = subject.BindModel(_actionContext, _modelBindingContext);

            actual.Should().BeFalse();
            _modelBindingContext.ModelState.IsValid.Should().BeFalse();
            _modelBindingContext.ModelState.Count.Should().Be(1);
            foreach (var modelStateValue in _modelBindingContext.ModelState.Values)
            {
                modelStateValue.Errors[0].ErrorMessage.Should().Be("'BadFormat' date is invalid");
            }
        }

        [Fact]
        public void CreateInvalidModelStateWhenToDateIsInIncorrectFormat()
        {
            AccidentStatisticsQueryModelBinder subject = new AccidentStatisticsQueryModelBinder();
            var invalidDate = "BadFormat";
            var url = $"http://localhost:9000/v1/accidentstatistics?to={invalidDate}";
            CreateActionAndBindingContextWith(url);

            var actual = subject.BindModel(_actionContext, _modelBindingContext);

            actual.Should().BeFalse();
            _modelBindingContext.ModelState.IsValid.Should().BeFalse();
            _modelBindingContext.ModelState.Count.Should().Be(1);
            foreach (var modelStateValue in _modelBindingContext.ModelState.Values)
            {
                modelStateValue.Errors[0].ErrorMessage.Should().Be("'BadFormat' date is invalid");
            }
        }

        private void CreateActionAndBindingContextWith(string url)
        {
            _actionContext = new HttpActionContext
            {
                ControllerContext = new HttpControllerContext(
                    new HttpConfiguration(),
                    new HttpRouteData(new HttpRoute()),
                    new HttpRequestMessage())
            };
            _actionContext.Request.RequestUri = new Uri(url);

            _modelBindingContext = new ModelBindingContext
            {
                ModelName = _autoFixture.Create<string>(),
                ModelMetadata = new ModelMetadata(new EmptyModelMetadataProvider(), null, null,
                    typeof(AccidentStatisticsQuery), null)
            };
        }
    }
}
