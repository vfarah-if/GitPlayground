import { AccidentStatistic } from './accident-statistic';

export interface PagedAccidentStatistic {
  total?: number;
  data?: Array<AccidentStatistic>;
  page?: number;
  pageSize?: number;
}
