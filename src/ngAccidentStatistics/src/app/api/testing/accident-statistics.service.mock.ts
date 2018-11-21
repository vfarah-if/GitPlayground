import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { AccidentStatisticsQuery, PagedAccidentStatistic } from '../../model';
import { AccidentStatiticsService } from '../accident-statistics.service';

// response test data in json wihin the file system for easy mocking of responses
import * as pageSizeOfOnePageOneOfTwoTestData from './response-with-total2-pageSize1-page2.json';
import * as pageSizeOfOnePageTwoOfTwoTestData from './response-with-total2-pageSize1-page2.json';
import * as  pageSizeOfTwoWithTotalOfTwoTestData from './response-with-total2-pagesize2.json';
// TODO: Add more scenarios here

// NOTE: Had to exclude mock from the compiler because it does not understand JASMINE and hence the testing folder being excluded

@Injectable({
  providedIn: 'root'
})
export class AccidentStatiticsServiceMock {


  public simplePageOneOfTwoResponseSubject: BehaviorSubject<PagedAccidentStatistic>
    = new BehaviorSubject<PagedAccidentStatistic>(pageSizeOfOnePageOneOfTwoTestData as PagedAccidentStatistic);
  public simplePageTwoOfTwoResponseSubject: BehaviorSubject<PagedAccidentStatistic>
    = new BehaviorSubject<PagedAccidentStatistic>(pageSizeOfOnePageTwoOfTwoTestData as PagedAccidentStatistic);
  public simpleOnlyOnePageNeededResponseSubject: BehaviorSubject<PagedAccidentStatistic>
    = new BehaviorSubject<PagedAccidentStatistic>(pageSizeOfTwoWithTotalOfTwoTestData as PagedAccidentStatistic);

  public spy_get = jasmine.createSpy('get');

  public get(query?: AccidentStatisticsQuery): Observable<PagedAccidentStatistic> {
    return this.spy_get(query);
  }
}

// tslint:disable-next-line:max-line-length
export function ACCIDENT_STATISTIC_SERVICE_PROVIDER(): { provide: typeof AccidentStatiticsService, useValue: AccidentStatiticsServiceMock } {
  return {
    provide: AccidentStatiticsService,
    useValue: new AccidentStatiticsServiceMock()
  };
}

export function getAccidentStatiticsService(): AccidentStatiticsServiceMock {
  return TestBed.get(AccidentStatiticsService);
}
