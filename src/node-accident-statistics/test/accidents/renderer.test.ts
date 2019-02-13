import request from "supertest";
import app from "../../src/app";

describe("GET /accidentsAPISummary", () => {
    it("should return 200", async () => {
        const response = await request(app).get("/accidentsAPISummary");
        expect(response.status).toBe(200);
    });
});
