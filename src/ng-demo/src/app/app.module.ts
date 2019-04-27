import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloWorldModule } from './hello-world';
import { HelloWorldUsersModule } from './api/hello-world-users';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HelloWorldModule,
    HelloWorldUsersModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }