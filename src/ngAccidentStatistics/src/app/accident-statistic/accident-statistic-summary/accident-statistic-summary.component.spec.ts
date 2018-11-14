import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentStatisticSummaryComponent } from './accident-statistic-summary.component';

describe('AccidentStatisticSummaryComponent', () => {
  let component: AccidentStatisticSummaryComponent;
  let fixture: ComponentFixture<AccidentStatisticSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentStatisticSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentStatisticSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
