import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentStatisticMapComponent } from './accident-statistic-map.component';

describe('AccidentStatisticMapComponent', () => {
  let component: AccidentStatisticMapComponent;
  let fixture: ComponentFixture<AccidentStatisticMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentStatisticMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentStatisticMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
