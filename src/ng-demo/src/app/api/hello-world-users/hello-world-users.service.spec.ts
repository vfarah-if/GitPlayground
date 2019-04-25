import { TestBed } from '@angular/core/testing';

import { HelloWorldUsersService } from './hello-world-users.service';

describe('HelloWorldUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HelloWorldUsersService = TestBed.get(HelloWorldUsersService);
    expect(service).toBeTruthy();
  });

  it('should generate a list of users', () => {
    const service: HelloWorldUsersService = TestBed.get(HelloWorldUsersService);

    const actualUsers = service.getAllUsers();

    expect(actualUsers.length).toBeGreaterThan(0);
  });
});
