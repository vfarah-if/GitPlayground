import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiModule } from './api';
import { AccidentStatisticModule } from './accident-statistic';
import { AccidentStatisticSummaryComponent } from './accident-statistic';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiModule,
    AccidentStatisticModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
