import request from "supertest";
import app from "../../../src/server";

describe("GET /v2/accidents/", () => {
    beforeAll(async (done) => {
        jest.setTimeout(10000);
        // set the global variables needed for the test
        process.env.NODE_ENV = "test";
        process.env.MONGO_URL = "mongodb://localhost:27017";
        process.env.MONGO_DB = "AccidentStatisticsTestDb";
        process.env.MONGO_COLLECTION = "AccidentStatisticsTest";
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

    it("should return data from the generated test database and then drop", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?pageSize=1");
        expect(response.status).toBe(200);
        expect(response.body.page).toBe(1);
        expect(response.body.data).toBeTruthy();
        expect(response.body.data.length).toBe(1);
        expect(response.body.pageSize).toBe(1);
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
