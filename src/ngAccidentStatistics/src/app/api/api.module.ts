import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AccidentStatiticsService } from './accident-statistics.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [AccidentStatiticsService]
})
export class ApiModule { }
