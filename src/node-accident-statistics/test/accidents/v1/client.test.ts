import { AccidentsQuery } from "../../../src/models/accidentsQuery";
import { TransportForLondonClient } from "./../../../src/accidents/v1/client/transportForLondonClient";

describe("TransportForLondonClient", () => {
    let client: TransportForLondonClient;
    let accidentsQuery: AccidentsQuery;

    beforeAll(() => {
        process.env.MAX_YEAR = "2017";
    });

    beforeEach(() => {
        client = new TransportForLondonClient();
        accidentsQuery = new AccidentsQuery();
    });

    it("should throw an error if the from year is less than 2005", async (done) => {
        accidentsQuery.from = new Date("2004-1-1");

        await client.getAccidentStatisticsByQuery(accidentsQuery)
            .catch((reason) => {
                expect(reason).toEqual(new Error("No data below 2005"));
                done();
            });
    });

    it("should throw an error if the to year is less than 2005", async (done) => {
        accidentsQuery.to = new Date("2004-1-1");

        await client.getAccidentStatisticsByQuery(accidentsQuery)
            .catch((reason) => {
                expect(reason).toEqual(new Error("No data below 2005"));
                done();
            });
    });

    it("should throw an error if the from year is greater than the max year configured", async (done) => {
        accidentsQuery.from = new Date("2018-1-1");

        await client.getAccidentStatisticsByQuery(accidentsQuery)
            .catch((reason) => {
                expect(reason).toEqual(new Error("No data greater than '2017'"));
                done();
            });
    });

    it("should throw an error if the to year is greater than the max year configured", async (done) => {
        accidentsQuery.to = new Date("2018-1-1");
        await client.getAccidentStatisticsByQuery(accidentsQuery)
            .catch((reason) => {
                expect(reason).toEqual(new Error("No data greater than '2017'"));
                done();
            });
    });
});
