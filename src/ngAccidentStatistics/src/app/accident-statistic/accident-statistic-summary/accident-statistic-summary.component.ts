import { Component, OnInit, Input } from '@angular/core';

import { SeverityOptions } from './../../model';

@Component({
  selector: 'app-accident-statistic-summary',
  templateUrl: './accident-statistic-summary.component.html',
  styleUrls: ['./accident-statistic-summary.component.scss']
})
export class AccidentStatisticSummaryComponent implements OnInit {

  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() severity: SeverityOptions;

  errorMessage: string;

  constructor() { }

  ngOnInit() {
    this.errorMessage = undefined;

    if (!this.fromDate) {
      this.fromDate = new Date('2005-1-1');
    }
    if (!this.toDate) {
      this.toDate = new Date('2017-12-31');
    }
    if (!this.severity) {
      this.severity = 'Fatal';
    }
  }
}
