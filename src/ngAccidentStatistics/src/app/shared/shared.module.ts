import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DateTimeComponent } from './date-time/date-time.component';

@NgModule({
  declarations: [DateTimeComponent],
  exports: [DateTimeComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
