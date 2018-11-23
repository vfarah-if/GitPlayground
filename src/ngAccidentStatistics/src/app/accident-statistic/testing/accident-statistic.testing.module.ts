import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccidentStatisticListMockComponent } from '../accident-statistic-list/testing';
import { AccidentStatisticMapMockComponent } from './../accident-statistic-map/testing';
import { AccidentStatisticQueryMockComponent } from './../accident-statistic-query/testing';

@NgModule({
  declarations: [
    AccidentStatisticListMockComponent,
    AccidentStatisticMapMockComponent,
    AccidentStatisticQueryMockComponent],
  imports: [
    CommonModule
  ],
  exports: [
    AccidentStatisticListMockComponent,
    AccidentStatisticMapMockComponent,
    AccidentStatisticQueryMockComponent]
})
export class AccidentStatisticTestingModule { }
