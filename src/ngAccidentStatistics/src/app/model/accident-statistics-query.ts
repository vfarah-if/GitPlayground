export type SortByOptions = 'DateAscending'|'LocationAscending'|'DateDescending'|'LocationDescending';
export type SeverityOptions = 'Serious' | 'Slight' | 'Fatal';

export interface AccidentStatisticsQuery {
  from?: Date;
  to?: Date;
  severity?: SeverityOptions;
  sortBy?: SortByOptions;
  page?: number;
  pageSize?: number;
}
