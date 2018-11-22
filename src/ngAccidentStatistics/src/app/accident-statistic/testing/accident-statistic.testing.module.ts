import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccidentStatisticListMockComponent } from '../accident-statistic-list/testing';
import { AccidentStatisticMapMockComponent } from './../accident-statistic-map/testing';

@NgModule({
  declarations: [
    AccidentStatisticListMockComponent, AccidentStatisticMapMockComponent],
  imports: [
    CommonModule
  ],
  exports: [AccidentStatisticListMockComponent, AccidentStatisticMapMockComponent]
})
export class AccidentStatisticTestingModule { }
