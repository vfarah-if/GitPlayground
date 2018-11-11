import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';

import { AccidentStatisticsQuery, PagedAccidentStatistic } from '../../model';
import { AccidentStatiticsService } from '../accident-statistics.service';

// NOTE: Had to exclude mock from the compiler because it does not understand JASMINE and hence the testing folder being excluded

@Injectable({
  providedIn: 'root'
})
export class AccidentStatiticsServiceMock {
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
