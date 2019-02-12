import request from "supertest";
import app from "../../src/app";

describe("App supported methods", () => {
    describe("GET /", () => {
        it("should return 200", (done) => {
            request(app).get("/")
                .expect(200, done);
        });
    });

    describe("GET /accidentsAPI", () => {
        it("should return 200", (done) => {
            request(app).get("/accidentsAPI")
                .expect(200, done);
        });
    });
});
