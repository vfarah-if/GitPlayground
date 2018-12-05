import { AccidentStatistic } from './accident-statistic';

export interface PagedAccidentStatistic {
  data?: Array<AccidentStatistic>;
  lastPage?: number;
  nextPage?: number;
  page?: number;
  previousPage?: number;
  pageSize?: number;
  total?: number;
}
