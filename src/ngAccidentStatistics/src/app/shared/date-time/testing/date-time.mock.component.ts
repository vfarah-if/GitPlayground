import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-date-time',
  template: '<time>Mock Date Time</time>'
})
export class DateTimeMockComponent {
  @Input() dateTime: string;
  date: Date;
}
