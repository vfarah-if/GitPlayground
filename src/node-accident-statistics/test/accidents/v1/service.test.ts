import { AccidentStatisticsService } from "../../../src/accidents/v1/services/accidentStatisticsService";
import { AccidentsQuery } from "../../../src/models/accidentsQuery";

describe("AccidentStatisticsService", () => {
    beforeAll(() => {
        process.env.MAX_YEAR = "2017";
    });

    it("should throw an error if the from year is less than 2005", async (done) => {
        const service = new AccidentStatisticsService();
        const accidentsQuery = new AccidentsQuery();
        accidentsQuery.from = new Date("2004-1-1");
        await service.get(accidentsQuery).catch((reason) => {
            expect(reason).toEqual(new Error("No data below 2005"));
            done();
        });
    });

    it("should throw an error if the to year is less than 2005", async (done) => {
        const service = new AccidentStatisticsService();
        const accidentsQuery = new AccidentsQuery();
        accidentsQuery.to = new Date("2004-1-1");
        await service.get(accidentsQuery).catch((reason) => {
            expect(reason).toEqual(new Error("No data below 2005"));
            done();
        });
    });

    it("should throw an error if the from year is greater than the max year configured", async (done) => {
        const service = new AccidentStatisticsService();
        const accidentsQuery = new AccidentsQuery();
        accidentsQuery.from = new Date("2018-1-1");
        await service.get(accidentsQuery).catch((reason) => {
            expect(reason).toEqual(new Error("No data greater than '2017'"));
            done();
        });
    });

    it("should throw an error if the to year is greater than the max year configured", async (done) => {
        const service = new AccidentStatisticsService();
        const accidentsQuery = new AccidentsQuery();
        accidentsQuery.to = new Date("2018-1-1");
        await service.get(accidentsQuery).catch((reason) => {
            expect(reason).toEqual(new Error("No data greater than '2017'"));
            done();
        });
    });
});
