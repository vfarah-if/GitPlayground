import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DateValueAccessorModule } from 'angular-date-value-accessor';

import { AccidentStatisticQueryComponent } from './accident-statistic-query/accident-statistic-query.component';
import { AccidentStatisticMapComponent } from './accident-statistic-map/accident-statistic-map.component';
import { AccidentStatisticListComponent } from './accident-statistic-list/accident-statistic-list.component';

@NgModule({
  declarations: [
    AccidentStatisticQueryComponent,
    AccidentStatisticMapComponent,
    AccidentStatisticListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DateValueAccessorModule,
    LeafletModule,
  ],
  exports: [
    AccidentStatisticQueryComponent,
    AccidentStatisticMapComponent,
    AccidentStatisticListComponent]
})
export class AccidentStatisticModule { }
