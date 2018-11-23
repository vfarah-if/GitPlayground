import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { AccidentStatisticQueryComponent } from './accident-statistic-query.component';
import {
  ACCIDENT_STATISTIC_SERVICE_PROVIDER,
  AccidentStatiticsServiceMock,
  getAccidentStatiticsService
} from './../../api/testing';

describe('AccidentStatisticQueryComponent', () => {
  let component: AccidentStatisticQueryComponent;
  let fixture: ComponentFixture<AccidentStatisticQueryComponent>;
  let apiService: AccidentStatiticsServiceMock;

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

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentStatisticQueryComponent);
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
