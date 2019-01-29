import { AccidentStatisticsQuery, SortByOptions, SeverityOptions } from '../model/accident-statistics-query';
import { PagedAccidentStatistic } from '../model/paged-accident-statistic';
import { TestBed, async, inject, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { AccidentStatiticsService } from './accident-statistics.service';
import { environment } from '../../environments/environment';
import {default as testData} from './accident-statistics.service.json';

describe('AccidentStatiticsService', () => {
  let testbed: TestBed;
  let service: AccidentStatiticsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccidentStatiticsService]
    });
    testbed = getTestBed();
    service = testbed.get(AccidentStatiticsService);
    httpMock = testbed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create test with all expectations', () => {
    expect(testbed).toBeTruthy();
    expect(service).toBeTruthy();
    expect(httpMock).toBeTruthy();
    expect(testData).toBeTruthy();
    expect(testData.data.length).toEqual(2);
    expect(testData.total).toEqual(32);
    expect(testData.page).toEqual(3);
    expect(testData.pageSize).toEqual(10);
  });

  describe('when using the get', () => {
    it('should call the the v2 uri by default with valid query parameters and assigned values', async () => {
      const fromDate = new Date(2014, 1, 1);
      const toDate = new Date(2018, 12, 31);
      const severity: SeverityOptions = 'Serious';
      const sortBy: SortByOptions = 'DateAscending';
      const currentPage = 2;
      const pageSize = 200;

      const query: AccidentStatisticsQuery = {
        from: fromDate,
        to: toDate,
        severity: severity,
        sortBy: sortBy,
        page: currentPage,
        pageSize: pageSize
      };
      service.get(query).subscribe();

      const expectedUrl = `${environment.accidentStatisticsBaseUrl}/v2/Accidents` +
        `?from=${fromDate.toISOString()}` +
        `&to=${toDate.toISOString()}` +
        `&severity=${severity}` +
        `&sortBy=${sortBy}` +
        `&page=${currentPage}` +
        `&pageSize=${pageSize}`;
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(`${environment.accidentStatisticsBaseUrl}/v2/Accidents`);
      expect(req.request.urlWithParams).toBe(expectedUrl);
    });

    it('should call the the v1 uri with valid query parameters and assigned values', async () => {
      const fromDate = new Date(2014, 1, 1);
      const toDate = new Date(2018, 12, 31);
      const severity: SeverityOptions = 'Serious';
      const sortBy: SortByOptions = 'DateAscending';
      const currentPage = 2;
      const pageSize = 200;

      const query: AccidentStatisticsQuery = {
        from: fromDate,
        to: toDate,
        severity: severity,
        sortBy: sortBy,
        page: currentPage,
        pageSize: pageSize,
        useV1: true
      };
      service.get(query).subscribe();

      const expectedUrl = `${environment.accidentStatisticsBaseUrl}/v1/Accidents` +
        `?from=${fromDate.toISOString()}` +
        `&to=${toDate.toISOString()}` +
        `&severity=${severity}` +
        `&sortBy=${sortBy}` +
        `&page=${currentPage}` +
        `&pageSize=${pageSize}`;
      const req: TestRequest = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.url).toBe(`${environment.accidentStatisticsBaseUrl}/v1/Accidents`);
      expect(req.request.urlWithParams).toBe(expectedUrl);
    });
  });
});
