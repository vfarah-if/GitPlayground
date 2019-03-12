import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';

// import { Observable } from 'rxjs/internal/observable';
// import { of } from 'rxjs/internal/observable/of';
import { Observable, of } from 'rxjs'; // TODO Remove when issue resolved

import { AccidentStatisticsQuery, PagedAccidentStatistic } from '../../model';
import { AccidentStatiticsService } from '../accident-statistics.service';

// response test data in json wihin the file system for easy mocking of responses
import { default as pageSizeOfOnePageOneOfTwoTestData } from './response-with-total2-pagesize1-page1.json';
import { default as pageSizeOfOnePageTwoOfTwoTestData } from './response-with-total2-pageSize1-page2.json';
import { default as pageSizeOfTwoWithTotalOfTwoTestData } from './response-with-total2-pagesize2.json';


// NOTE: Had to exclude mock from the compiler because it does not understand JASMINE and hence the testing folder being excluded

@Injectable({
  providedIn: 'root'
})
export class AccidentStatiticsServiceMock {
  public simplePageOneOfTwoResponseSubject: Observable<PagedAccidentStatistic>
    = of(pageSizeOfOnePageOneOfTwoTestData as PagedAccidentStatistic);
  public simplePageTwoOfTwoResponseSubject: Observable<PagedAccidentStatistic>
    = of(pageSizeOfOnePageTwoOfTwoTestData as PagedAccidentStatistic);
  public simpleOnlyOnePageNeededResponseSubject: Observable<PagedAccidentStatistic>
    = of(pageSizeOfTwoWithTotalOfTwoTestData as PagedAccidentStatistic);

  public spy_get = jasmine.createSpy('get');

  public get(query?: AccidentStatisticsQuery): Observable<PagedAccidentStatistic> {
    return this.spy_get(query);
  }
}

export function ACCIDENT_STATISTIC_SERVICE_PROVIDER(): {
  provide: typeof AccidentStatiticsService,
  useValue: AccidentStatiticsServiceMock
} {
  return {
    provide: AccidentStatiticsService,
    useValue: new AccidentStatiticsServiceMock()
  };
}

export function getAccidentStatiticsService(): AccidentStatiticsServiceMock {
  return TestBed.get(AccidentStatiticsService);
}
