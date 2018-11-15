import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DateValueAccessorModule } from 'angular-date-value-accessor';

import { AccidentStatisticSummaryComponent } from './accident-statistic-summary/accident-statistic-summary.component';
import { AccidentStatisticMapComponent } from './accident-statistic-map/accident-statistic-map.component';

@NgModule({
  declarations: [AccidentStatisticSummaryComponent, AccidentStatisticMapComponent],
  imports: [
    CommonModule,
    FormsModule,
    DateValueAccessorModule
  ],
  exports: [AccidentStatisticSummaryComponent, AccidentStatisticMapComponent]
})
export class AccidentStatisticModule { }
