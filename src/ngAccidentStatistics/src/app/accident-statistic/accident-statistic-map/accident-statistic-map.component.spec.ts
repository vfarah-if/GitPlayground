import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TileLayer, GridLayerOptions } from 'leaflet';

import { AccidentStatisticMapComponent } from './accident-statistic-map.component';
import {
  ACCIDENT_STATISTIC_SERVICE_PROVIDER,
  AccidentStatiticsServiceMock,
  getAccidentStatiticsService
} from './../../api/testing';
import { DEFAULT_FROM_DATE, MAXIMUM_YEAR } from '../constants';
import { DateTimeMockComponent } from './../../shared/date-time/testing';

function headerElement(compiled): HTMLHeadingElement {
  return compiled.querySelector('section > header > h1');
}

function imageMarkerElements(compiled): Array<HTMLImageElement> {
  return compiled.querySelectorAll('section > div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-marker-pane > img');
}

function popupDivElement(compiled): HTMLDivElement {
  // tslint:disable-next-line:max-line-length
  return compiled.querySelector('section > div > div.leaflet-pane.leaflet-map-pane > div.leaflet-pane.leaflet-popup-pane > div > div.leaflet-popup-content-wrapper > div');
}

describe('AccidentStatisticMapComponent', () => {
  let component: AccidentStatisticMapComponent;
  let fixture: ComponentFixture<AccidentStatisticMapComponent>;
  let apiService: AccidentStatiticsServiceMock;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LeafletModule],
      declarations: [AccidentStatisticMapComponent, DateTimeMockComponent],
      providers: [
        ACCIDENT_STATISTIC_SERVICE_PROVIDER()
      ]
    }).compileComponents();
  }));

  describe('Given default settings', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AccidentStatisticMapComponent);
      component = fixture.componentInstance;
      apiService = getAccidentStatiticsService();
      apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should create with default expectations', () => {
      expect(component).toBeTruthy();
      expect(component.from).toBe(DEFAULT_FROM_DATE);
      expect(component.to.toISOString()).toBe(`${MAXIMUM_YEAR}-12-31T12:00:00.000Z`);
      expect(component.pageSize).toBe(500);
      expect(component.severityOption).toBe('Fatal');
      expect(component.imageOption).toBe('Macarbe');
      expect(component.zoom).toBe(9);
      expect(component.maxZoom).toBe(18);
      expect(component.useGeolocationPosition).toBe(false);
      expect(apiService).toBeTruthy();
    });

    it('should create default header', async(() => {
      const header = headerElement(compiled);
      expect(header).toBeTruthy();
      // tslint:disable-next-line:max-line-length
      const expectedHeader = `Map of fatal accidents from Mock Date Time to Mock Date Time (2 Total)`;
      expect(header.innerText).toBe(expectedHeader);
    }));

    it('should create exactly two fatal image markers on the map', async(() => {
      const images = imageMarkerElements(compiled);
      const expectedMacarbeImageUrl = 'https://static.thenounproject.com/png/14312-200.png';

      expect(images).toBeTruthy();
      expect(images.length).toBe(2);
      expect(images[0].src).toBe(expectedMacarbeImageUrl);
      expect(images[1].src).toBe(expectedMacarbeImageUrl);
    }));

    it('should create a pop up on the first image describing the incident when clicked', async(() => {
      const images = imageMarkerElements(compiled);

      images[0].click();

      const popupElement = popupDivElement(compiled);
      expect(popupElement).toBeTruthy();
      // tslint:disable-next-line:max-line-length
      expect(popupElement.innerText).toContain('Fatal Incident 632474, occured on Thu Jan 05 2017 09:11:00 GMT+0000 (Greenwich Mean Time), involving 1 casualty and 2 vehicles in the borough of Kingston.');
    }));

    it('should create a pop up on the second image describing the incident when clicked', async(() => {
      const images = imageMarkerElements(compiled);

      images[1].click();

      const popupElement = popupDivElement(compiled);
      expect(popupElement).toBeTruthy();
      // tslint:disable-next-line:max-line-length
      expect(popupElement.innerText).toContain('Fatal Incident 615289, occured on Fri Dec 29 2017 10:58:00 GMT+0000 (Greenwich Mean Time), involving 1 casualty and 1 vehicle in the borough of City of Westminster.');
    }));
  });

  describe('Given a Friendly image type', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AccidentStatisticMapComponent);
      component = fixture.componentInstance;
      component.imageOption = 'Friendly';
      apiService = getAccidentStatiticsService();
      apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should create exactly two friendly image markers on the map', async(() => {
      const images = imageMarkerElements(compiled);
      const expectedFriendlyImageUrl = 'https://image.flaticon.com/icons/svg/130/130163.svg';


      expect(images).toBeTruthy();
      expect(images.length).toBe(2);
      expect(images[0].src).toBe(expectedFriendlyImageUrl);
      expect(images[1].src).toBe(expectedFriendlyImageUrl);
    }));
  });

  describe('Given a Marker image type', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AccidentStatisticMapComponent);
      component = fixture.componentInstance;
      component.imageOption = 'Marker';
      apiService = getAccidentStatiticsService();
      apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should create exactly two friendly image markers on the map', async(() => {
      const images = imageMarkerElements(compiled);
      const expectedHeatmapImageUrl = 'http://localhost:9876/marker-icon.png';

      expect(images).toBeTruthy();
      expect(images.length).toBe(2);
      expect(images[0].src).toBe(expectedHeatmapImageUrl);
      expect(images[1].src).toBe(expectedHeatmapImageUrl);
    }));
  });

  describe('Given the option to use the GeoLocation api to get the users current position', () => {
    let geolocationSpy: jasmine.Spy;
    let userPosition: Position;

    beforeEach(() => {
      fixture = TestBed.createComponent(AccidentStatisticMapComponent);
      component = fixture.componentInstance;
      component.useGeolocationPosition = true;
      apiService = getAccidentStatiticsService();
      apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
      userPosition = <Position>{
        coords: {
          latitude: 60,
          longitude: -1.12184322,
          accuracy: 0.1
        }
      };
      geolocationSpy = spyOn(window.navigator.geolocation, 'getCurrentPosition');
      geolocationSpy.and.callFake(function (callback) {
        callback(userPosition);
      });
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should call the windows navigator to get and set the current position of the user', () => {
      expect(geolocationSpy).toHaveBeenCalled();
      expect(component.latitude).toBe(userPosition.coords.latitude);
      expect(component.longitude).toBe(userPosition.coords.longitude);
    });
  });

  describe('Given custom map configuration', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(AccidentStatisticMapComponent);
      component = fixture.componentInstance;
      component.imageOption = 'Marker';
      component.severityOption = 'Serious';
      component.fromDate = '2017-01-01T22:00:00.000Z';
      component.toDate = '2017-02-02T13:00:00.000Z';
      component.pageSize = 2;
      component.zoom = 1;
      component.maxZoom = 2;
      apiService = getAccidentStatiticsService();
      apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should call the accident statistic service twice with custom values', async(() => {
      expect(apiService.spy_get).toHaveBeenCalledTimes(2);

      expect(apiService.spy_get).toHaveBeenCalledWith({
        pageSize: component.pageSize,
        from: component.from,
        to: component.to,
        severity: component.severityOption,
      });

      expect(apiService.spy_get).toHaveBeenCalledWith({
        pageSize: component.pageSize,
        from: component.from,
        to: component.to,
        page: 2,
        severity: component.severityOption,
      });
    }));

    it('should set the zoom on the map', () => {
      expect(component.leafletOptions).toBeDefined();
      expect(component.leafletOptions.zoom).toBe(component.zoom);
    });

    it('should set the max zoom on the only configured layer', () => {
      expect(component.leafletOptions.layers).toBeDefined();
      expect(component.leafletOptions.layers.length).toBeGreaterThanOrEqual(1);
      const layer = <TileLayer>component.leafletOptions.layers[0];
      expect(layer.options).toBeDefined();
      expect(layer.options.maxZoom).toBe(component.maxZoom);
    });
  });
});
