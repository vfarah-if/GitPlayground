import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { AccidentStatisticsQuery, PagedAccidentStatistic } from '../model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AccidentStatiticsService {

  private basePath = environment.accidentStatisticsBaseUrl;

  constructor(
    private httpClient: HttpClient,
  ) { }

  public get(query?: AccidentStatisticsQuery): Observable<PagedAccidentStatistic> {

    let queryParams = new HttpParams();
    let headers = new HttpHeaders();
    if (query) {
      if (query.from) {
        queryParams = queryParams.set('from', query.from.toISOString());
      }

      if (query.to) {
        queryParams = queryParams.set('to', query.to.toISOString());
      }

      if (query.severity) {
        queryParams = queryParams.set('severity', query.severity);
      }

      if (query.sortBy) {
        queryParams = queryParams.set('sortBy', query.sortBy);
      }

      if (query.page) {
        queryParams = queryParams.set('page', query.page.toString());
      }

      if (query.pageSize) {
        queryParams = queryParams.set('pageSize', query.pageSize.toString());
      }
    }

    headers = headers.set('Accept', 'application/json');
    const url = query.useV1 ? `${this.basePath}/v1/AccidentStatistics` : `${this.basePath}/v2/Accidents`;
    return this.httpClient.get<PagedAccidentStatistic>(url,
      {
        params: queryParams,
        headers: headers
      }
    );
  }
}
