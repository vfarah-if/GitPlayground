export type SortByOptions = 'DateAscending' | 'LocationAscending' | 'DateDescending' |
  'LocationDescending' | 'BoroughAscending' | 'AccidentStatisticIdAscending' |
  'TflIdAscending' | 'BoroughDescending' | 'AccidentStatisticIdDescending' | 'TflIdDescending';
export type SeverityOptions = 'Serious' | 'Slight' | 'Fatal';

export interface AccidentStatisticsQuery {
  from?: Date;
  to?: Date;
  severity?: SeverityOptions;
  sortBy?: SortByOptions;
  page?: number;
  pageSize?: number;
  useV1?: boolean;
}
