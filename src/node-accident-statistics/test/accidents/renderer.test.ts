import request from "supertest";
import app from "../../src/app";

describe("GET /accidentsAPISummary", () => {
    it("should return 200", (done) => {
        request(app).get("/accidentsAPISummary")
            .expect(200, done);
    });
});
