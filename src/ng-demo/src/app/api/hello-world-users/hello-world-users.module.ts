import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloWorldUsersService } from './hello-world-users.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    HelloWorldUsersService
  ]
})
export class HelloWorldUsersModule { }
