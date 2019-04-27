import helloWorldUsersService from './HelloWorldUsersService';

describe('HelloWorldUsersService', () => {
        
    it('should create a service', async() => {        
        const actual = await helloWorldUsersService.getAllUsers();
        expect(actual.length).toBe(3);
    })    
})
