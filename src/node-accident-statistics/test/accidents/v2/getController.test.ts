import request from "supertest";
import app from "../../../src/server";

describe("GET /v2/accidents", () => {
    it("should return 200 with default query with expected values and date descending", async (done) => {
        const response = await request(app)
        .get("/v2/accidents")
        .set("Accept", "application/json");
        // tslint:disable-next-line:no-console
        // console.log("/v2/accidents Responded with => ", response);

        expect(response.body.page).toBe(1);
        expect(response.body.pageSize).toBe(100);
        expect(response.body.data).toBeTruthy();
        expect(response.body.data.length).toBe(100);
        expect(response.body.pageSize).toBe(100);
        expect(response.body.lastPage).toBe(3);
        expect(response.body.nextPage).toBe(2);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with date ascending", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&orderBy=DateAscending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with location ascending", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&orderBy=locationascending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with location descending", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&orderBy=locationdescending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with borough ascending", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&orderBy=boroughAscending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with borough descending", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&orderBy=boroughDescending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with tflid ascending", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&orderBy=tflidascending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with tflid descending", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&orderBy=tfliddescending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with accidentstatisticid ascending", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&orderBy=accidentstatisticidascending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with accidentstatisticid descending", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&orderBy=accidentstatisticiddescending&severity=Fatal");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with severity slight", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&severity=Slight");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });

    it("should return 200 with severity serious", async (done) => {
        const response = await request(app)
            .get("/v2/accidents?page=2&pageSize=10&severity=Serious");
        expect(response.status).toBe(200);
        expect(response.body).toMatchSnapshot();
        done();
    });
});
