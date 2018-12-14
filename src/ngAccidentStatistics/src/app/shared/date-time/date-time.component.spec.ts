import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeComponent } from './date-time.component';

function getTimeElement(compiled): HTMLTimeElement {
  return compiled.querySelector('time');
}

describe('DateTimeComponent', () => {
  let component: DateTimeComponent;
  let fixture: ComponentFixture<DateTimeComponent>;
  let compiled;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DateTimeComponent]
    }).compileComponents();
  }));

  describe('with default settings', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(DateTimeComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should create with expectations', () => {
      expect(component).toBeTruthy();
      expect(compiled).toBeTruthy();
    });

    it('should create data with current date time', () => {
      const currentISODateString = new Date().toISOString();
      const isoDateWithOutMilliseconds = currentISODateString.substring(0, currentISODateString.length - 5);
      const timeElement = getTimeElement(compiled);
      expect(timeElement).toBeTruthy();
      const dateTimeAttribute = timeElement.attributes['datetime'];
      expect(dateTimeAttribute).toBeTruthy();
      expect(dateTimeAttribute.value).toContain(isoDateWithOutMilliseconds);
    });
  });

  describe('with assigned date', () => {
    const assignedISODate = new Date(2017, 1, 1, 1, 1, 1, 1).toISOString();

    beforeEach(() => {
      fixture = TestBed.createComponent(DateTimeComponent);
      component = fixture.componentInstance;
      component.dateTime = assignedISODate;
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
    });

    it('should create component with an assigned date', () => {
      const timeElement = getTimeElement(compiled);
      expect(timeElement).toBeTruthy();
      const dateTimeAttribute = timeElement.attributes['datetime'];

      expect(dateTimeAttribute).toBeTruthy();
      expect(dateTimeAttribute.value).toContain(assignedISODate);
    });
  });
});
