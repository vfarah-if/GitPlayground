import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentStatisticQueryComponent } from './accident-statistic-query.component';

describe('AccidentStatisticQueryComponent', () => {
  let component: AccidentStatisticQueryComponent;
  let fixture: ComponentFixture<AccidentStatisticQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentStatisticQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentStatisticQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
