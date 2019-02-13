import request from "supertest";
import app from "../../../src/server";

describe("GET /v2/accidents", () => {
    it("should return 200 with default query", async (done) => {
        const response = await request(app)
        .get("/v2/accidents")
        .set("Accept", "application/json");
        // tslint:disable-next-line:no-console
        // console.log("/v1/accidents Responded with => ", response);

        expect(response.body.page).toBe(1);
        expect(response.body.pageSize).toBe(100);
        expect(response.body.sortBy).toBe("DateDescending");
        expect(response.body.from).toBe("2017-01-01T00:00:00.000Z");
        expect(response.body.to).toBe("2017-12-31T00:00:00.000Z");
        expect(response.body.severity).toBe("Fatal");
        done();
    });
});
