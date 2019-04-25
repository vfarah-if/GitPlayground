import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.scss']
})
export class HelloWorldComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
    console.log("Oninit");
  }

  ngOnDestroy(): void {
    console.log("OnDestroy");
  }
}
