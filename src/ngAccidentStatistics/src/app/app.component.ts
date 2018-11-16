import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/internal/observable';
import { EMPTY } from 'rxjs/internal/observable/EMPTY';
import { map, expand, reduce } from 'rxjs/internal/operators';
import { AccidentStatistic, PagedAccidentStatistic } from './model';
import { AccidentStatiticsService } from './api/accident-statistics.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngAccidentStatistics';
  accidentStatics$: Observable<Array<AccidentStatistic>>;
  accidentStatisticsFirstPage$: Observable<PagedAccidentStatistic>;
  constructor(private accidentStatisticService: AccidentStatiticsService) {
  }

  ngOnInit(): void {
    this.accidentStatisticsFirstPage$ = this.accidentStatisticService.get({ pageSize: 500, from: new Date(2014, 1, 1) });

    this.accidentStatics$ = this.accidentStatisticsFirstPage$
      .pipe(
        expand(({ nextPage }) => {
          // debugger;
          return nextPage ? this.accidentStatisticService.get({ pageSize: 500, from: new Date(2014, 1, 1), page: nextPage }) : EMPTY;
        }),
        map(({ data }) => data),
        reduce((acc, data) => acc.concat(data), [])
      );
  }
}
