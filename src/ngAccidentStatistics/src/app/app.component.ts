import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable'
import { map } from 'rxjs/internal/operators';
import { AccidentStatistic } from './model';
import { AccidentStatiticsService } from './api/accident-statistics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngAccidentStatistics';
  accidentStatics$: Observable<Array<AccidentStatistic>>;
  constructor(private accidentStatisticService: AccidentStatiticsService) {
  }

  ngOnInit(): void {
    //TODO: Remove, hard test to get project up and running
    this.accidentStatics$ = this.accidentStatisticService.get({ pageSize: 2000, from: new Date(2014, 1, 1) }).pipe(map(data => data.data));
  }
}
