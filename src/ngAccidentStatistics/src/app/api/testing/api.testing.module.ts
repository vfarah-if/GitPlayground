import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';

import { AccidentStatiticsServiceMock } from './accident-statistics.service.mock';

@NgModule({
  imports: [HttpClientTestingModule],
  providers: [AccidentStatiticsServiceMock]
})
export class ApiTestingModule { }
