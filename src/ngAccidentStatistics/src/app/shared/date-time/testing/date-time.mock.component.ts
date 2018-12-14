import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-time',
  template: '<span>Mock Date Time</span>'
})
export class DateTimeMockComponent {
  @Input() dateTime: string;
  date: Date;
}
