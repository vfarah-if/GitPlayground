import { NgModule } from '@angular/core';
import { AccidentStatiticsService } from './accident-statistics.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [HttpClientModule],
  providers: [AccidentStatiticsService]
})
export class ApiModule { }
