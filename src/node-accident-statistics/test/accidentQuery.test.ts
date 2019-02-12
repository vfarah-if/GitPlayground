import { AccidentsQuery } from "../src/models/accidentsQuery";

describe("AccidentStatisticsQuery", () => {
    it("should create a query object with all the expected default values", () => {
        const accidentStatisticsQuery = new AccidentsQuery();
        // tslint:disable-next-line:no-console
        // console.log("Query => ", accidentStatisticsQuery);
        expect(accidentStatisticsQuery).toBeTruthy();
        expect(accidentStatisticsQuery.from).toBeTruthy();
        expect(accidentStatisticsQuery.to).toBeTruthy();
        expect(accidentStatisticsQuery.severity).toBe("Fatal");
        expect(accidentStatisticsQuery.sortBy).toBe("DateDescending");
    });

    it("should allow sortBy to be overriden with property orderBy", () => {
        const accidentStatisticsQuery = new AccidentsQuery();

        accidentStatisticsQuery.orderBy = "AccidentStatisticIdDescending";
        // tslint:disable-next-line:no-console
        console.log("Query => ", accidentStatisticsQuery);

        expect(accidentStatisticsQuery.sortBy).toBe("AccidentStatisticIdDescending");
    });
});
