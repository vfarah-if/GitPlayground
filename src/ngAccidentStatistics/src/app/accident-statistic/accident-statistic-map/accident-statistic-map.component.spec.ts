import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AccidentStatisticMapComponent } from './accident-statistic-map.component';
import {
  ACCIDENT_STATISTIC_SERVICE_PROVIDER,
  AccidentStatiticsServiceMock,
  getAccidentStatiticsService
} from './../../api/testing';

describe('AccidentStatisticMapComponent', () => {
  let component: AccidentStatisticMapComponent;
  let fixture: ComponentFixture<AccidentStatisticMapComponent>;
  let apiService: AccidentStatiticsServiceMock;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LeafletModule],
      declarations: [AccidentStatisticMapComponent],
      providers: [
        ACCIDENT_STATISTIC_SERVICE_PROVIDER()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentStatisticMapComponent);
    component = fixture.componentInstance;
    apiService = getAccidentStatiticsService();
    apiService.spy_get.and.returnValues(apiService.simplePageOneOfTwoResponseSubject, apiService.simplePageTwoOfTwoResponseSubject);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(apiService).toBeTruthy();
  });
});
