import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';

import { SeverityOptions, PagedAccidentStatistic } from '../../../model';

@Component({
  selector: 'app-accident-statistic-query',
  template: '<p>Mock Accident Statistic Query Component</p>'
})
export class AccidentStatisticQueryMockComponent {

  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() severityOption: SeverityOptions;
  @Input() pageSize: Number = 1;

  error: any;
  accidentStatisticsForm: FormGroup;
  pagedAccidentStatistics$: Observable<PagedAccidentStatistic>;
  pagedAccidentStatistics: PagedAccidentStatistic;
}
