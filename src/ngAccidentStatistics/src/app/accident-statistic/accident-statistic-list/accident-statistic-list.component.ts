import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs/internal/observable';
import { EMPTY } from 'rxjs/internal/observable/EMPTY';
import { map, expand, reduce } from 'rxjs/internal/operators';

import { AccidentStatiticsService } from './../../api';
import { AccidentStatistic, PagedAccidentStatistic, SeverityOptions } from './../../model';

@Component({
  selector: 'app-accident-statistic-list',
  templateUrl: './accident-statistic-list.component.html',
  styleUrls: ['./accident-statistic-list.component.scss']
})
export class AccidentStatisticListComponent implements OnInit {
  @Input() fromDate: string;
  @Input() severityOption: SeverityOptions = 'Fatal';
  @Input() pageSize = 500;

  public accidentStatics$: Observable<Array<AccidentStatistic>>;
  public accidentStatisticsFirstPage$: Observable<PagedAccidentStatistic>;
  public from: Date;

  constructor(private accidentStatisticService: AccidentStatiticsService) { }

  ngOnInit() {
    if (this.fromDate) {
      this.from = new Date(this.fromDate);
    } else {
      this.from = new Date(2010, 1, 1);
    }

    if (!this.severityOption) {
      this.severityOption = 'Fatal';
    }

    this.accidentStatisticsFirstPage$ = this.accidentStatisticService.get({
      pageSize: this.pageSize,
      from: this.from,
      severity: this.severityOption });

    this.accidentStatics$ = this.accidentStatisticsFirstPage$
      .pipe(
        expand(({ nextPage }) =>  nextPage
          ? this.accidentStatisticService.get({
              pageSize: this.pageSize,
              from: this.from,
              page: nextPage,
              severity: this.severityOption })
          : EMPTY),
        map(({ data }) => data),
        reduce((acc, data) => acc.concat(data), [])
      );
  }
}
