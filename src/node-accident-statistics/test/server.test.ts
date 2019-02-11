import request from "supertest";
import server from "../src/server";

describe("GET /v1/accidents", () => {
    it("should return 200", (done) => {
        request(server).get("/v1/accidents")
            .expect(200, done);
    });
});

describe("GET /v2/accidents", () => {
    it("should return 200", (done) => {
        request(server).get("/v2/accidents")
            .expect(200, done);
    });
});
