import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldComponent } from './hello-world.component';

@NgModule({
  declarations: [HelloWorldComponent],
  imports: [
    CommonModule
  ],
  export: [
    HelloWorldComponent
  ]
})
export class HelloWorldModule { }
