import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { AccidentStatisticListComponent, DEFAULT_FROM_DATE } from './accident-statistic-list.component';
import {
  ACCIDENT_STATISTIC_SERVICE_PROVIDER,
  AccidentStatiticsServiceMock,
  getAccidentStatiticsService
} from './../../api/testing';
import { PagedAccidentStatistic } from './../../model/paged-accident-statistic';

export function getHeader(compiled): HTMLHeadingElement {
  return compiled.querySelector('section > header > h1');
}

fdescribe('AccidentStatisticListComponent', () => {
  let component: AccidentStatisticListComponent;
  let fixture: ComponentFixture<AccidentStatisticListComponent>;
  let apiService: AccidentStatiticsServiceMock;
  let compiled;
  let lastYear: number;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccidentStatisticListComponent],
      providers: [
        ACCIDENT_STATISTIC_SERVICE_PROVIDER()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentStatisticListComponent);
    component = fixture.componentInstance;
    apiService = getAccidentStatiticsService();
    apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
    lastYear = new Date().getFullYear() - 1;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create component with default expectations', () => {
    expect(component).toBeTruthy();
    expect(compiled).toBeTruthy();
    expect(component.from).toBe(DEFAULT_FROM_DATE);
    expect(component.to.toISOString()).toBe(`${lastYear}-12-31T12:00:00.000Z`);
    expect(component.orderByOption).toBe('DateDescending');
    expect(component.pageSize).toBe(500);
    expect(component.showJson).toBe(false);
    expect(apiService).toBeTruthy();
  });

  it('should create default header', async(() => {
      const header = getHeader(compiled);
      expect(header).toBeTruthy();
      // tslint:disable-next-line:max-line-length
      const expectedHeader = `Loading 2 fatal accidents list from Feb 1, 2010, 12:00:00 AM to Dec 31, ${lastYear}, 12:00:00 PM, ordered by datedescending`;
      expect(header.innerText).toBe(expectedHeader);
  }));

  it('should call the accident statistic service twice with all the default values', async(() => {
    expect(apiService.spy_get).toHaveBeenCalledTimes(2);

    expect(apiService.spy_get).toHaveBeenCalledWith({
      pageSize: component.pageSize,
      from: component.from,
      to: component.to,
      severity: component.severityOption,
      sortBy: component.orderByOption,
      });

      expect(apiService.spy_get).toHaveBeenCalledWith({
        pageSize: component.pageSize,
        from: component.from,
        to: component.to,
        page: 2,
        severity: component.severityOption,
        sortBy: component.orderByOption,
        });
  }));

});
