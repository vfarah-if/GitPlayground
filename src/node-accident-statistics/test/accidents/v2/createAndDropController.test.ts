import nock from "nock";
import request from "supertest";
import app from "../../../src/server";
import { default as testData } from "./createAndDropController.test.data.json";

describe("GET /v2/accidents/", () => {
    beforeAll(async (done) => {
      // set the global variables needed for the test
        process.env.NODE_ENV = "test";
        process.env.MONGO_URL = "mongodb://localhost:27017";
        process.env.MONGO_DB = "AccidentStatisticsTestDb";
        process.env.MONGO_COLLECTION = "AccidentStatisticsTest";

        nock("https://api.tfl.gov.uk")
            .get("/AccidentStats/2017")
            .reply(200, testData);

        await dropDatabase();
        const response = await request(app)
            .get("/v2/accidents/seedData?from=2017");
        expect(response.status).toBe(201);
        done();
    });

    afterAll(async (done) => {
        await dropDatabase();
        await checkDatabaseIsGone();
        done();
    });

    it("should return 200 if the database has already been created", async (done) => {
        const response = await request(app)
            .get("/v2/accidents/seedData?from=2017");
        expect(response.status).toBe(200);
        done();
    });

    it("should return data from the generated test database and then drop", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?pageSize=1");
        expect(response.status).toBe(200);
        expect(response.body.page).toBe(1);
        expect(response.body.data).toBeTruthy();
        expect(response.body.data.length).toBe(1);
        expect(response.body.pageSize).toBe(1);
        expect(response.body.total).toBe(20);
        done();
    });

    async function checkDatabaseIsGone() {
        const response = await request(app)
            .get("/v2/accidents?pageSize=1");
        const expectedError = 500;
        expect(response.status).toBe(expectedError);
    }

    async function dropDatabase() {
        const response = await request(app)
            .get("/v2/accidents/dropDb");
        expect(response.status).toBe(202);
    }
});
