import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss']
})
export class DateTimeComponent implements OnInit {
  @Input() dateTime: string;
  date: Date;

  constructor() { }

  ngOnInit() {
    if (this.dateTime) {
      this.date = new Date(this.dateTime);
    } else {
      this.date = new Date();
    }
  }
}
