import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/internal/Observable';
import { map, expand, switchMap } from 'rxjs/internal/operators';

import { SeverityOptions, PagedAccidentStatistic } from './../../model';
import { AccidentStatiticsService } from './../../api';

@Component({
  selector: 'app-accident-statistic-summary',
  templateUrl: './accident-statistic-summary.component.html',
  styleUrls: ['./accident-statistic-summary.component.scss']
})
export class AccidentStatisticSummaryComponent implements OnInit {

  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Input() severityOption: SeverityOptions;

  errorMessage: string;
  accidentStatisticsForm: FormGroup;
  pagedAccidentStatistics$: Observable<PagedAccidentStatistic>;

  constructor(
    private formBuilder: FormBuilder,
    private accidentStatisticService: AccidentStatiticsService) {
    this.fromDate = new Date('2017-1-1');
    this.toDate = new Date('2017-12-31');
  }

  ngOnInit() {
    this.errorMessage = undefined;

    this.accidentStatisticsForm = this.formBuilder.group({
      from: [this.fromDate],
      to: [this.toDate],
      severity: [this.severityOption, Validators.required]
    });

    this.pagedAccidentStatistics$ = this.accidentStatisticsForm.valueChanges.pipe(
      switchMap(data => {
        // debugger;
        return this.accidentStatisticService.get({
          pageSize: 1,
          from: data.from,
          to: data.to,
          severity: data.severity
        });
      })
    );
  }
}
