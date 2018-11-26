import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AccidentStatisticMapComponent } from './accident-statistic-map.component';
import {
  ACCIDENT_STATISTIC_SERVICE_PROVIDER,
  AccidentStatiticsServiceMock,
  getAccidentStatiticsService
} from './../../api/testing';
import { DEFAULT_FROM_DATE } from '..';

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



fdescribe('AccidentStatisticMapComponent', () => {
  let component: AccidentStatisticMapComponent;
  let fixture: ComponentFixture<AccidentStatisticMapComponent>;
  let apiService: AccidentStatiticsServiceMock;
  let lastYear: number;
  let compiled: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LeafletModule],
      declarations: [AccidentStatisticMapComponent],
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
      lastYear = new Date().getFullYear() - 1;
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should create with default expectations', () => {
      expect(component).toBeTruthy();
      expect(component.from).toBe(DEFAULT_FROM_DATE);
      expect(component.to.toISOString()).toBe(`${lastYear}-12-31T12:00:00.000Z`);
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
      const expectedHeader = `Map of fatal accidents from Feb 1, 2010, 12:00:00 AM to Dec 31, ${lastYear}, 12:00:00 PM (2 Total)`;
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
      expect(popupElement.innerText).toContain('Fatal Incident 632474, occured on Thu Jan 05 2017 09:11:00 GMT+0000 (Greenwich Mean Time), involving 1 casualty and 2 vehicles in the borough of Kingston.')
    }));

    it('should create a pop up on the second image describing the incident when clicked', async(() => {
      const images = imageMarkerElements(compiled);

      images[1].click();

      const popupElement = popupDivElement(compiled);
      expect(popupElement).toBeTruthy();
      // tslint:disable-next-line:max-line-length
      expect(popupElement.innerText).toContain('Fatal Incident 615289, occured on Fri Dec 29 2017 10:58:00 GMT+0000 (Greenwich Mean Time), involving 1 casualty and 1 vehicle in the borough of City of Westminster.')
    }));

    // TODO: Test specific settings like:
    //       1. useGeolocationPosition
    //       2. different image types
    //       3. The service gets called with other values
    // TODO: Remove the fdescribe and for other tests to run
  });
});
