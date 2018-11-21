import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
// import {
//   ACCIDENT_STATISTIC_SERVICE_PROVIDER,
//   AccidentStatiticsServiceMock,
//   getAccidentStatiticsService
// } from './api/testing'; // TODO: Remove

import { AccidentStatistic, PagedAccidentStatistic } from './model';
import { AccidentStatisticTestingModule } from './accident-statistic/testing';

fdescribe('AppComponent', () => {

  // let apiService: AccidentStatiticsServiceMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AccidentStatisticTestingModule,
      ],
      declarations: [
        AppComponent
      ],
      // providers: [
      //   ACCIDENT_STATISTIC_SERVICE_PROVIDER() // TODO: Remove - just added for probing
      // ]
    }).compileComponents();
    // apiService = getAccidentStatiticsService();
    // apiService.spy_get.and.returnValue(apiService.simpleOnlyOnePageNeededResponseSubject);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
    //expect(apiService).toBeTruthy();
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
