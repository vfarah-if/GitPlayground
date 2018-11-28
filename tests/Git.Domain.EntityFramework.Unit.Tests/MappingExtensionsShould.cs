using System;
using System.Linq;
using AutoFixture;
using FluentAssertions;
using Git.Domain.Models.TFL;
using Xunit;

namespace Git.Domain.EntityFramework.Unit.Tests
{
    public class MappingExtensionsShould
    {
        private readonly Fixture _autoFixture;
        private readonly AccidentStatistic _accidentStatistic;

        public MappingExtensionsShould()
        {
            _autoFixture = new Fixture();
            _accidentStatistic = CreateAccidentStatistic();
        }

        [Fact]
        public void MapAccidentStatisticToAccidentStatisticDb()
        {
            var actual = _accidentStatistic.ConvertFrom();

            actual.Should().NotBeNull();
            actual.Borough.Should().BeEquivalentTo(_accidentStatistic.Borough);
            actual.Date.Should().Be(_accidentStatistic.Date);
            actual.Latitude.Should().BeEquivalentTo(_accidentStatistic.Latitude);
            actual.Location.Should().BeEquivalentTo(_accidentStatistic.Location);
            actual.Longitude.Should().BeEquivalentTo(_accidentStatistic.Longitude);
            actual.Severity.Should().BeEquivalentTo(_accidentStatistic.Severity);
        }

        [Fact]
        public void MapAccidentStatisticCasualtiesToAccidentStatisticDbCasualties()
        {
            var actual = _accidentStatistic.ConvertFrom();

            actual.Should().NotBeNull();
            actual.Casualties.Count.Should().Be(_accidentStatistic.Casualties.Count);
            for (var i = 0; i < actual.Casualties.Count; i++)
            {
                var actualCasualty = actual.Casualties.ElementAt(i);
                var originalCasualty = _accidentStatistic.Casualties[i];
                actualCasualty.Age.Should().Be(originalCasualty.Age);
                actualCasualty.AgeBand.Should().Be(originalCasualty.AgeBand);
                actualCasualty.Class.Should().Be(originalCasualty.Class);
                actualCasualty.Mode.Should().Be(originalCasualty.Mode);
                actualCasualty.Severity.Should().Be(originalCasualty.Severity);
            }
        }

        [Fact]
        public void MapAccidentStatisticVehiclesToAccidentStatisticDbVehicles()
        {
            var actual = _accidentStatistic.ConvertFrom();

            actual.Should().NotBeNull();
            actual.Vehicles.Count.Should().Be(_accidentStatistic.Casualties.Count);
            for (var i = 0; i < actual.Vehicles.Count; i++)
            {
                var actualVehicle = actual.Vehicles.ElementAt(i);
                var originalVehicle = _accidentStatistic.Vehicles[i];
                actualVehicle.VehicleType.Should().Be(originalVehicle.VehicleType);
            }
        }

        private AccidentStatistic CreateAccidentStatistic()
        {
            return _autoFixture.Build<AccidentStatistic>()
                .With(x => x.DateAsString, new DateTime(2017, 03, 03).ToString("yyyy-MM-ddTHH:mm:ssZ"))
                .Create();
        }
    }
}
