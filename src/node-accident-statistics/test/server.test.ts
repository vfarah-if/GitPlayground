import request from "supertest";
import app from "../src/server";

describe("SERVER supported API", () => {
    describe("GET /v1/accidents", () => {
        it("should return 200 with default query", (done) => {
            request(app).get("/v1/accidents")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .then((response) => {
                    expect(response.body.page).toBe(1);
                    expect(response.body.pageSize).toBe(100);
                    expect(response.body.sortBy).toBe("DateDescending");
                    expect(response.body.from).toBe("2017-01-01T00:00:00.000Z");
                    expect(response.body.to).toBe("2017-12-31T00:00:00.000Z");
                    expect(response.body.severity).toBe("Fatal");
                    done();
                });
        });

        it("should return 200 with query parameters", (done) => {
            request(app).get("/v1/accidents?page=2&pageSize=90&orderBy=BoroughDescending&severity=Slight")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .then((response) => {
                    expect(response.body.page).toBe("2");
                    expect(response.body.pageSize).toBe("90");
                    expect(response.body.sortBy).toBe("BoroughDescending");
                    expect(response.body.from).toBe("2017-01-01T00:00:00.000Z");
                    expect(response.body.to).toBe("2017-12-31T00:00:00.000Z");
                    expect(response.body.severity).toBe("Slight");
                    done();
                });
        });
    });

    describe("GET /v2/accidents", () => {
        it("should return 200 with default query", (done) => {
            request(app).get("/v2/accidents")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .then((response) => {
                    // tslint:disable-next-line:no-console
                    // console.log("Responded with => ", response.body);
                    expect(response.body.page).toBe(1);
                    expect(response.body.pageSize).toBe(100);
                    expect(response.body.sortBy).toBe("DateDescending");
                    expect(response.body.from).toBe("2017-01-01T00:00:00.000Z");
                    expect(response.body.to).toBe("2017-12-31T00:00:00.000Z");
                    expect(response.body.severity).toBe("Fatal");
                    done();
                });
        });
    });
});
