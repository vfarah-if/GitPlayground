﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Git.Domain.Models.TFL;
using Git.Domain.Owin.Api.v1.Models;
using static Git.Domain.Constants.AccidentStatisticSorting;

namespace Git.Domain.Owin.Api.v1.Services
{
    public class AccidentStatisticsService : IAccidentStatisticsService
    {
        private readonly ITransportForLondonClient _transportForLondonClient;
        private readonly Dictionary<string, SortOptions<AccidentStatistic>> _sortOptions;

        public AccidentStatisticsService(ITransportForLondonClient transportForLondonClient)
        {
            this._transportForLondonClient = transportForLondonClient;
            _sortOptions = new Dictionary<string, SortOptions<AccidentStatistic>>(StringComparer.InvariantCultureIgnoreCase)
            {
                { "ByDateAscending", ByDateAscending },
                { "ByLocationAscending", ByLocationAscending },
                { "BySeverityAscending", BySeverityAscending },
                { "ByDateDescending", ByDateDescending },
                { "ByLocationDescending", ByLocationDescending },
                { "BySeverityDescending", BySeverityDescending },
            };
        }
        public async Task<Paged<AccidentStatistic>> GetAccidentStatistics(AccidentStatisticsQuery accidentStatisticsQuery)
        {
            return await _transportForLondonClient.GetAccidentStatistics(
                accidentStatisticsQuery.From,
                accidentStatisticsQuery.To,
                ParseSeverity(accidentStatisticsQuery.Severity),
                ParseSortBy(accidentStatisticsQuery.SortBy),
                accidentStatisticsQuery.Page,
                accidentStatisticsQuery.PageSize);
        }

        private SortOptions<AccidentStatistic> ParseSortBy(string sortBy)
        {
            return string.IsNullOrEmpty(sortBy) ? ByDateDescending : _sortOptions[sortBy] ?? ByDateDescending;
        }

        private static Severity ParseSeverity(string severity)
        {
            return Enum.TryParse(severity, true, out Severity result) ? result : Severity.Fatal;
        }
    }
}