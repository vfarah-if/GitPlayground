export type SortByOptions = 'ByDateAscending'|'ByLocationAscending'|'ByDateDescending'|'ByLocationDescending';
export type SeverityOptions = 'Serious' | 'Slight' | 'Fatal';

export interface AccidentStatisticsQuery {
  from?: Date;
  to?: Date;
  severity?: SeverityOptions;
  sortBy?: SortByOptions;
  page?: number;
  pageSize?: number;
}
