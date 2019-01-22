import { DateTimeMockComponent } from './../../shared/date-time/testing/date-time.mock.component';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { AccidentStatisticListComponent } from './accident-statistic-list.component';
import {
  ACCIDENT_STATISTIC_SERVICE_PROVIDER,
  AccidentStatiticsServiceMock,
  getAccidentStatiticsService
} from './../../api/testing';
import { DEFAULT_FROM_DATE, MAXIMUM_YEAR } from '../constants';

function headerElement(compiled): HTMLHeadingElement {
  return compiled.querySelector('section > header > h1');
}

function orderedListElements(compiled): Array<HTMLLIElement> {
  return compiled.querySelectorAll('section > ol > li');
}

function dataListElements(compiled): Array<HTMLDataListElement> {
  return compiled.querySelectorAll('section > ol span dl');
}

function preElements(compiled): Array<HTMLPreElement> {
  return compiled.querySelectorAll('section > ol pre');
}

describe('AccidentStatisticListComponent', () => {
  let component: AccidentStatisticListComponent;
  let fixture: ComponentFixture<AccidentStatisticListComponent>;
  let apiService: AccidentStatiticsServiceMock;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccidentStatisticListComponent, DateTimeMockComponent],
      providers: [
        ACCIDENT_STATISTIC_SERVICE_PROVIDER()
      ]
    }).compileComponents();
  }));

  describe('Given default settings', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AccidentStatisticListComponent);
      component = fixture.componentInstance;
      apiService = getAccidentStatiticsService();
      apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should create component with default expectations', () => {
      expect(component).toBeTruthy();
      expect(compiled).toBeTruthy();
      expect(component.from).toBe(DEFAULT_FROM_DATE);
      expect(component.to.toISOString()).toBe(`${MAXIMUM_YEAR}-12-31T12:00:00.000Z`);
      expect(component.orderByOption).toBe('DateDescending');
      expect(component.pageSize).toBe(500);
      expect(component.showJson).toBe(false);
      expect(component.severityOption).toBe('Fatal');
      expect(apiService).toBeTruthy();
    });

    it('should create default header', async(() => {
      const header = headerElement(compiled);
      expect(header).toBeTruthy();
      // tslint:disable-next-line:max-line-length
      const expectedHeader = `Loading 2 fatal accidents list from Mock Date Time to Mock Date Time, ordered by datedescending`;
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
        sortBy: component.orderByOption
      });
    }));

    it('should have two list items with accident details', async(() => {
      const orderedListItems = orderedListElements(compiled);
      const expectedFirstItemDescription =
        // tslint:disable-next-line:max-line-length
        'Accident Id: 632474 on Mock Date Time at location Traps Lane junction with Coombe Lane west in the borough of Kingston, with 1 casualty and 2 vehicles of types MediumGoodsVehicle, Motorcycle_50_125cc.';
      const expectedSecondItemDescription =
        // tslint:disable-next-line:max-line-length
        'Accident Id: 615289 on Mock Date Time at location Horseferry Road junction with Medway Street in the borough of City of Westminster, with 1 casualty and 1 vehicle of type Taxi.';

      expect(orderedListItems).toBeTruthy();
      expect(orderedListItems.length).toBe(2);
      expect(orderedListItems[0].innerText).toContain(expectedFirstItemDescription);
      expect(orderedListItems[1].innerText).toContain(expectedSecondItemDescription);
    }));

    it('should have two data list elements under each description', async(() => {
      const dataListItems = dataListElements(compiled);
      const expectedItem1Description =
        'Casualty 1 with fatal severity, is a 46 year old adult driver (PoweredTwoWheeler)';
      const expectedItem2Description =
        'Casualty 1 with fatal severity, is a 67 year old adult pedestrian (Pedestrian)';

      expect(dataListItems).toBeTruthy();
      expect(dataListItems.length).toBe(2);
      expect(dataListItems[0].innerText).toContain(expectedItem1Description);
      expect(dataListItems[1].innerText).toContain(expectedItem2Description);
    }));
  });

  describe('Given configured settings', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AccidentStatisticListComponent);
      component = fixture.componentInstance;
      apiService = getAccidentStatiticsService();
      apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
      component.fromDate = '2017-01-01T22:00:00.000Z';
      component.toDate = '2017-02-02T13:00:00.000Z';
      component.pageSize = 20;
      component.orderByOption = 'LocationAscending';
      component.severityOption = 'Serious';
      component.showJson = true;
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should create component with configured expectations', () => {
      expect(component).toBeTruthy();
      expect(compiled).toBeTruthy();
      expect(component.from.toISOString()).toBe('2017-01-01T22:00:00.000Z');
      expect(component.to.toISOString()).toBe('2017-02-02T13:00:00.000Z');
      expect(component.orderByOption).toBe('LocationAscending');
      expect(component.pageSize).toBe(20);
      expect(component.showJson).toBe(true);
      expect(component.severityOption).toBe('Serious');
      expect(apiService).toBeTruthy();
    });

    it('should call the accident statistic service twice with all the configured values', async(() => {
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
        sortBy: component.orderByOption
      });
    }));

    it('should have two pre elements showing json content', async(() => {
      const preElementItems = preElements(compiled);

      expect(preElementItems).toBeTruthy();
      expect(preElementItems.length).toBe(2);
      expect(preElementItems[0].innerText).toContain('"id": 632474,');
      expect(preElementItems[1].innerText).toContain('"id": 615289,');
    }));
  });
});
