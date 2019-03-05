
import nock from "nock";
import request from "supertest";
import app from "../../../src/server";
import { default as testData } from "./controller.test.data.json";

describe("GET /v1/accidents", () => {
    beforeEach(() => {
        process.env.TFL_ACCIDENTS_URL = "https://api.tfl.gov.uk/AccidentStats";
        nock("https://api.tfl.gov.uk")
            .get("/AccidentStats/2017")
            .reply(200, testData);
    });

    it("should create test with all expectations", () => {
        expect(testData).toBeTruthy();
    });

    it("should return 200 with default query", async (done) => {
        const response = await request(app).get("/v1/accidents");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with borough descending", async (done) => {
        const response = await request(app)
            .get("/v1/accidents?page=2&pageSize=10&orderBy=BoroughDescending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with borough ascending", async (done) => {
        const response = await request(app)
            .get("/v1/accidents?page=1&pageSize=10&orderBy=BoroughAscending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with location ascending", async (done) => {
        const response = await request(app)
            .get("/v1/accidents?page=1&pageSize=10&orderBy=LocationAscending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with location descending", async (done) => {
        const response = await request(app)
            .get("/v1/accidents?page=1&pageSize=10&orderBy=LocationDescending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with date ascending", async (done) => {
        const response = await request(app)
            .get("/v1/accidents?page=1&pageSize=10&orderBy=DateAscending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return No data below 2005 when from date out of range", async (done) => {
        const response = await request(app)
            .get("/v1/accidents?from=2004-01-01");
        expect(response.status).toBe(500);
        done();
    });

    it("should return No data greater than '2017' when to date out of range", async (done) => {
        const response = await request(app)
            .get("/v1/accidents?from=2019-01-01");
        expect(response.status).toBe(500);
        done();
    });

    it("should swap the dates when from is greater than to date", async (done) => {
        const response = await request(app)
            .get("/v1/accidents?from=2017-12-31&to=2017-01-01");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });
});
