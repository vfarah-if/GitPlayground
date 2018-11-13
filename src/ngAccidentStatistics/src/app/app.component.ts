import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable'
import { map, expand, reduce } from 'rxjs/internal/operators';
import { AccidentStatistic, PagedAccidentStatistic } from './model';
import { AccidentStatiticsService } from './api/accident-statistics.service';
import { empty } from 'rxjs/internal/observable/empty';

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
    this.accidentStatisticsFirstPage$ = this.accidentStatisticService.get({ pageSize: 100, from: new Date(2017, 1, 1) });

    this.accidentStatics$ = this.accidentStatisticsFirstPage$
      .pipe(
        expand(({ nextPage }) => {
          return nextPage ? this.accidentStatisticService.get({ pageSize: 100, from: new Date(2005, 1, 1), page: nextPage }) : empty();
        }),
        map(({ data }) => data),
        reduce((acc, data) => acc.concat(data), [])
      );
  }
}
