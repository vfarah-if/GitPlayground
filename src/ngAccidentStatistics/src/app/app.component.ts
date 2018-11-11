import { Component, OnInit } from '@angular/core';

import { AccidentStatistic } from './model';

import { AccidentStatiticsService } from './api/accident-statistics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ngAccidentStatistics';
  accidentStatics: Array<AccidentStatistic>;
  constructor(private accidentStatisticService: AccidentStatiticsService) {
  }

  ngOnInit(): void {
    // TODO: Remove, hard test to get project up and running
    this.accidentStatisticService.get().subscribe(data => {
      debugger;
      this.accidentStatics = data.data;
    });
  }
}
