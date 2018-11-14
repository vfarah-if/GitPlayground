import { Component, OnInit, Input } from '@angular/core';

import { SeverityOptions } from './../../model';

@Component({
  selector: 'app-accident-statistic-summary',
  templateUrl: './accident-statistic-summary.component.html',
  styleUrls: ['./accident-statistic-summary.component.scss']
})
export class AccidentStatisticSummaryComponent implements OnInit {

  @Input() from: Date;
  @Input() to: Date;
  @Input() severity: SeverityOptions;

  errorMessage: string;

  constructor() { }

  ngOnInit() {
    this.errorMessage = undefined;

    if (!this.from) {
      this.from = new Date(2005, 1, 1);
    }
    if (!this.to) {
      const now = new Date();
      const previousYear = (now.getFullYear() - 1);
      this.to = new Date(previousYear, 12, 31, 0, 0, 0, 0);
    }
    if (!this.severity) {
      this.severity = 'Fatal';
    }
  }

}
