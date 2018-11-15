import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { switchMap, catchError, startWith, mergeMap } from 'rxjs/internal/operators';

import { SeverityOptions, PagedAccidentStatistic } from './../../model';
import { AccidentStatiticsService } from './../../api';
import { empty } from 'rxjs';

@Component({
  selector: 'app-accident-statistic-summary',
  templateUrl: './accident-statistic-summary.component.html',
  styleUrls: ['./accident-statistic-summary.component.scss']
})
export class AccidentStatisticSummaryComponent implements OnInit {

  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() severityOption: SeverityOptions;

  error: any;
  accidentStatisticsForm: FormGroup;
  pagedAccidentStatistics$: Observable<PagedAccidentStatistic>;

  constructor(
    private formBuilder: FormBuilder,
    private accidentStatisticService: AccidentStatiticsService) {
    this.severityOption = 'Fatal';
  }

  ngOnInit() {
    this.accidentStatisticsForm = this.formBuilder.group({
      from: [this.fromDate],
      to: [this.toDate],
      severity: [this.severityOption],
      pageSize: [2],
    });

    this.pagedAccidentStatistics$ = this.accidentStatisticsForm.valueChanges.pipe(
      // startWith(this.accidentStatisticsForm.value), // Note errors dont get raised now because of this
      mergeMap(data => {
        // debugger;
        this.clearErrors();
        return this.accidentStatisticService.get({
          pageSize: 1,
          from: data.from,
          to: data.to,
          severity: data.severity
        });
      }),
      catchError(fail => {
        this.error = fail;
        return this.pagedAccidentStatistics$;
      })
    );
  }

  private clearErrors(): any {
    this.error = undefined;
  }
}
