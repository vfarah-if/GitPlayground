import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelloWorldUsersService {

  constructor() { }

  public getAllUsers(): Array<string> {
    return new Array<string>('James', 'John', 'Gabriel');
  }
}
