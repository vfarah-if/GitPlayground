import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Observable, empty } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/internal/operators';

import { SeverityOptions, PagedAccidentStatistic, SortByOptions } from '../../model';
import { AccidentStatiticsService } from '../../api';

@Component({
  selector: 'app-accident-statistic-query',
  templateUrl: './accident-statistic-query.component.html',
  styleUrls: ['./accident-statistic-query.component.scss']
})
export class AccidentStatisticQueryComponent implements OnInit {

  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() severityOption: SeverityOptions;
  @Input() orderByOption: SortByOptions = 'DateDescending';
  @Input() pageSize: Number = 1;

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
      from: [this.fromDate, Validators.required],
      to: [this.toDate],
      severity: [this.severityOption],
      pageSize: [this.pageSize],
      useV1: [false],
      sortBy: [this.orderByOption]
    });

    this.pagedAccidentStatistics$ = this.accidentStatisticsForm.valueChanges.pipe(
      switchMap(data => {
        // debugger;
        this.clearErrors();
        if (!this.accidentStatisticsForm.invalid) {
          return this.accidentStatisticService.get({
            pageSize: data.pageSize,
            from: data.from,
            to: data.to,
            severity: data.severity,
            useV1: data.useV1,
            sortBy: data.sortBy
          });
        } else {
          return empty();
        }
      }),
      catchError(fail => {
        this.error = fail;
        return this.pagedAccidentStatistics$;
      })
      , tap(data => {
        // Output result so we dont fire several observers but NOTE this has side effects and is not a good pattern
        // however firing several calls to get the result is not good either
        this.pagedAccidentStatistics = data;
      })
    );
  }

  private clearErrors(): any {
    this.error = undefined;
  }
}
