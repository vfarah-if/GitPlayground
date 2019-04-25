import { Component, OnInit } from '@angular/core';
import { HelloWorldUsersService } from './api/hello-world-users';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-demo';
  users: Array<string>;
  constructor(private helloWorldUsersService: HelloWorldUsersService) {
  }

  ngOnInit(): void {
    this.users = this.helloWorldUsersService.getAllUsers();
  }
}
