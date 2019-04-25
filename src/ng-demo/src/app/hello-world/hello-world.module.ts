import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldComponent } from './hello-world.component';
import { ShoutPipe } from './shout.pipe';

@NgModule({
  declarations: [HelloWorldComponent, ShoutPipe],
  imports: [
    CommonModule
  ],
  exports: [
    HelloWorldComponent
  ]
})
export class HelloWorldModule { }
