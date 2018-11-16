import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { switchMap, catchError, startWith, tap } from 'rxjs/internal/operators';

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
  pagedAccidentStatistics: PagedAccidentStatistic;

  constructor(
    private formBuilder: FormBuilder,
    private accidentStatisticService: AccidentStatiticsService) {
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
      switchMap(data => {
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
      , tap(data => {
        // Output result so we dont fire several observers but NOTE this has side effects and is not a good pattern
        // however firing several calls to get the result is not good either
        this.pagedAccidentStatistics = data;
        return data;
      })
    );
  }

  private clearErrors(): any {
    this.error = undefined;
  }
}
