import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AccidentStatisticQueryComponent } from './accident-statistic-query.component';
import {
  ACCIDENT_STATISTIC_SERVICE_PROVIDER,
  AccidentStatiticsServiceMock,
  getAccidentStatiticsService
} from './../../api/testing';
import { SeverityOptions, SortByOptions } from './../../model';

function selectElement(compiled: any, name: string): HTMLSelectElement {
  return compiled.querySelector(`select[name='${name}']`);
}

function preElement(compiled: any): HTMLPreElement {
  return compiled.querySelector('pre');
}

describe('AccidentStatisticQueryComponent', () => {
  let component: AccidentStatisticQueryComponent;
  let fixture: ComponentFixture<AccidentStatisticQueryComponent>;
  let apiService: AccidentStatiticsServiceMock;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule],
      declarations: [ AccidentStatisticQueryComponent ],
      providers: [
        ACCIDENT_STATISTIC_SERVICE_PROVIDER()
      ]
    }).compileComponents();
  }));

  describe('With default settings', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AccidentStatisticQueryComponent);
      component = fixture.componentInstance;
      apiService = getAccidentStatiticsService();
      apiService.spy_get.and.returnValue(apiService.simpleOnlyOnePageNeededResponseSubject);
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should create with default expectations', () => {
      expect(component).toBeTruthy();
      expect(component.fromDate).toBeUndefined();
      expect(component.pageSize).toBe(1);
      expect(component.severityOption).toBeUndefined();
      expect(component.orderByOption).toBe('DateDescending');
      expect(apiService).toBeTruthy();
      expect(compiled).toBeTruthy();
      expect(fixture).toBeTruthy();
    });

    it('should load and display data when the only required from value is set', fakeAsync(() => {
      const fromDate = '01/01/2017';
      component.accidentStatisticsForm.controls.from.setValue(fromDate);
      fixture.detectChanges();

      tick();

      expect(apiService.spy_get).toHaveBeenCalledTimes(1);
      expect(apiService.spy_get).toHaveBeenCalledWith({
        pageSize: 1,
        from: fromDate,
        to: null,
        severity: null,
        useV1: false,
        sortBy: 'DateDescending'
      });

      const jsonElement = preElement(compiled);
      expect(jsonElement).toBeTruthy();
      expect(jsonElement.innerText).toContain('id": 632474');
    }));

    it('should load data with alternative values', fakeAsync(() => {
      const fromDate = '01/01/2017';
      const toDate = '01/02/2017';
      const severityOption: SeverityOptions = 'Slight';
      const isV1 = true;
      const sortOption: SortByOptions = 'LocationAscending';
      const pageSize = 10;
      component.accidentStatisticsForm.controls.from.setValue(fromDate);
      component.accidentStatisticsForm.controls.to.setValue(toDate);
      component.accidentStatisticsForm.controls.severity.setValue(severityOption);
      component.accidentStatisticsForm.controls.useV1.setValue(isV1);
      component.accidentStatisticsForm.controls.sortBy.setValue(sortOption);
      component.accidentStatisticsForm.controls.pageSize.setValue(pageSize);
      fixture.detectChanges();

      tick();

      expect(apiService.spy_get).toHaveBeenCalledWith({
        pageSize: pageSize,
        from: fromDate,
        to: toDate,
        severity: severityOption,
        useV1: isV1,
        sortBy: sortOption
      });
    }));

    it('should change the sort option values based on the api', fakeAsync(() => {
      const fromDate = '01/01/2017';
      let isV1 = false;
      const expectAllSortingOptions = 10;
      const expectPartialSortingOptions = 4;

      component.accidentStatisticsForm.controls.from.setValue(fromDate);
      component.accidentStatisticsForm.controls.useV1.setValue(isV1);
      fixture.detectChanges();

      tick();

      const sortyByElement = selectElement(compiled, 'sortBy');
      expect(sortyByElement).toBeTruthy();
      expect(sortyByElement.options.length).toBe(expectAllSortingOptions);

      isV1 = true;
      component.accidentStatisticsForm.controls.useV1.setValue(isV1);
      fixture.detectChanges();

      tick();
      expect(sortyByElement.options.length).toBe(expectPartialSortingOptions);
    }));
  });
});
