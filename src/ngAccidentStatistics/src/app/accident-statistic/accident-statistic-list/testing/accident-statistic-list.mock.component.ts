import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { AccidentStatistic, PagedAccidentStatistic, SeverityOptions, SortByOptions } from '../../../model';

@Component({
  selector: 'app-accident-statistic-list',
  template: '<p>Mock accident statistic list component</p>'
})
export class AccidentStatisticListMockComponent {
  @Input() fromDate: string;
  @Input() toDate: string;
  @Input() severityOption: SeverityOptions = 'Fatal';
  @Input() orderByOption: SortByOptions = 'DateDescending';
  @Input() pageSize = 500;
  @Input() showJson = false;

  public accidentStatics$: Observable<Array<AccidentStatistic>>;
  public accidentStatisticsFirstPage$: Observable<PagedAccidentStatistic>;
  public from: Date;
  public to: Date;
}
