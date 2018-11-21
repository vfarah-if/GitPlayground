import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccidentStatisticListMockComponent } from '../accident-statistic-list/testing/accident-statistic-list.mock.component';

@NgModule({
  declarations: [
    AccidentStatisticListMockComponent],
  imports: [
    CommonModule
  ],
  exports: [AccidentStatisticListMockComponent]
})
export class AccidentStatisticTestingModule { }
