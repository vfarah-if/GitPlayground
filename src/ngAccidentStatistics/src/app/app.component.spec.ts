import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {
  ACCIDENT_STATISTIC_SERVICE_PROVIDER,
  AccidentStatiticsServiceMock,
  getAccidentStatiticsService
} from './api/testing'; // TODO: Remove
// import { ApiTestingModule } from './api/testing/api.testing.module';
import { AccidentStatistic, PagedAccidentStatistic } from './model';

describe('AppComponent', () => {

  let apiService: AccidentStatiticsServiceMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        // ApiTestingModule  // TODO: Remove - just added for probing
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        ACCIDENT_STATISTIC_SERVICE_PROVIDER() // TODO: Remove - just added for probing
      ]
    }).compileComponents();
    apiService = getAccidentStatiticsService();
    const response: PagedAccidentStatistic = {
      total: 1,
      data: [{
        id: 615289,
        lat: '51.495614',
        lon: '-0.133148',
        location: 'Horseferry Road junction with Medway Street',
        date: '2017-12-29T10:58:00Z',
        severity: 2,
        borough: 'City of Westminster',
        casualties: [{
          age: 67,
          class: 'Pedestrian',
          severity: 2,
          mode: 'Pedestrian',
          ageBand: 'Adult'
        }],
        vehicles: [{
          type: 'Taxi'
        }]
      },
      {
        id: 295099,
        lat: '51.495614',
        lon: '-0.133148',
        location: 'Horseferry Road junction with Medway Street',
        date: '2017-12-29T10:58:00Z',
        severity: 2,
        borough: 'City of Westminster',
        casualties: [{
          age: 67,
          class: 'Pedestrian',
          severity: 2,
          mode: 'Pedestrian',
          ageBand: 'Adult'
        }],
        vehicles: [{
          type: 'Taxi'
        }]
      }],
      page: 1,
      pageSize: 2
    };


    apiService.spy_get.and.returnValue(new BehaviorSubject<PagedAccidentStatistic>(response));
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    expect(apiService).toBeTruthy();
  });

  it(`should have as title 'ngAccidentStatistics'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ngAccidentStatistics');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ngAccidentStatistics!');
  });
});
