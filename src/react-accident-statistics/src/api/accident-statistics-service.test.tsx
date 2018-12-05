
import * as moxios from 'moxios';

// import * as testData from './accident-statistics-service.json';
// import { default as testData } from './accident-statistics-service.json';
// import testData from './accident-statistics-service.json';
// const testData = require('./accident-statistics-service.json');

import { AccidentStatisticsService } from './accident-statistics-service';


describe('AccidentStatisticsService', () => {
    let service: AccidentStatisticsService;
    beforeEach(() => {
        moxios.install()
        // service = new AccidentStatisticsService();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('should create test with all expectations', () => {
        // expect(testData).toBeTruthy();
        expect(service).toBeTruthy();
    });

    // it('should understand how Moxios works by the end of this', () => {
    //     moxios.wait(() => {
    //         let request = moxios.requests.mostRecent()
    //         request.respondWith({
    //             status: 200,
    //             response: testData
    //         });
    //     });

    //     service.get()

    // });
});