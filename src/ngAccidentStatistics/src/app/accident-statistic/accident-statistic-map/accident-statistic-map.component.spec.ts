import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AccidentStatisticMapComponent } from './accident-statistic-map.component';
import {
  ACCIDENT_STATISTIC_SERVICE_PROVIDER,
  AccidentStatiticsServiceMock,
  getAccidentStatiticsService
} from './../../api/testing';
import { DEFAULT_FROM_DATE } from '..';

describe('AccidentStatisticMapComponent', () => {
  let component: AccidentStatisticMapComponent;
  let fixture: ComponentFixture<AccidentStatisticMapComponent>;
  let apiService: AccidentStatiticsServiceMock;
  let lastYear: number;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LeafletModule],
      declarations: [AccidentStatisticMapComponent],
      providers: [
        ACCIDENT_STATISTIC_SERVICE_PROVIDER()
      ]
    }).compileComponents();
  }));

  fdescribe('Given default settings', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AccidentStatisticMapComponent);
      component = fixture.componentInstance;
      apiService = getAccidentStatiticsService();
      apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
      lastYear = new Date().getFullYear() - 1;
      fixture.detectChanges();
    });

    fit('should create with default expectations', () => {
      expect(component).toBeTruthy();
      expect(component.from).toBe(DEFAULT_FROM_DATE);
      expect(component.to.toISOString()).toBe(`${lastYear}-12-31T12:00:00.000Z`);
      expect(component.pageSize).toBe(500);
      expect(component.severityOption).toBe('Fatal');
      expect(component.imageOption).toBe('Macarbe');
      expect(component.zoom).toBe(9);
      expect(component.maxZoom).toBe(18);
      expect(apiService).toBeTruthy();
    });

    // TODO: Test the header
    // TODO: Test the two positions on the map
    // TODO: Test the popup on the map when click displays expected message
    // TODO: Fix the pop up message to display the accident summary better with pluralizations
    // TODO: Remove the fdescribe and for other tests to run
  });
});
