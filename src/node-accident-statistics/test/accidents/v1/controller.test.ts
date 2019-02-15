
import nock from "nock";
import request from "supertest";
import app from "../../../src/server";
import { default as testData } from "./controller.test.data.json";

describe("GET /v1/accidents", () => {
    beforeAll(() => {
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
        // tslint:disable-next-line:no-console
        // console.log("/v1/accidents Responded with => ", response);
        expect(response.status).toBe(200);
        done();
    });

    it("should return 200 with query parameters", async (done) => {
        const response = await request(app)
            .get("/v1/accidents?page=2&pageSize=90&orderBy=BoroughDescending&severity=Slight");
        // tslint:disable-next-line:no-console
        // console.log("/v1/accidents Responded with => ", response);
        expect(response.status).toBe(200);
        done();
    });
});
