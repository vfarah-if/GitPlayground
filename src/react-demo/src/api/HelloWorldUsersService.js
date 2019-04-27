class HelloWorldUsersService {    
    async getAllUsers() {
        const result = [];
        result.push('James', 'John', 'Gabriel');
        return Promise.resolve(result);
    }
}

export default new HelloWorldUsersService()