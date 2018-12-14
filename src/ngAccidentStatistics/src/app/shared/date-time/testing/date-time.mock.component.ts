import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-time',
  template: '<p>Mock Date time'
})
export class DateTimeMockComponent implements OnInit {
  @Input() dateTime: string;
  date: Date;
}
