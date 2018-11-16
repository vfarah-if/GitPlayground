import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentStatisticListComponent } from './accident-statistic-list.component';

describe('AccidentStatisticListComponent', () => {
  let component: AccidentStatisticListComponent;
  let fixture: ComponentFixture<AccidentStatisticListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentStatisticListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentStatisticListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
