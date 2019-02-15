import { ExtendedArray } from "./../../src/arrays/extendedArray";
import { Paging } from "./../../src/models/paging";
// Lots of repetitive scenarios, easy to test with in a configured file, very readable too
import { default as testScenarios } from "./paging.test.scenarios.json";

describe("Paging", () => {
    let paginator: Paging<number>;
    let data: ExtendedArray<number>;

    beforeEach(() => {
        paginator = new Paging<number>();
    });

    it("should create paginator with expectations", () => {
        expect(testScenarios).toBeTruthy();
        expect(paginator).toBeTruthy();
    });

    it("should throw an error if pagesize of zero is assigned", () => {
        const testData = new ExtendedArray([1, 2]);
        expect(() => paginator.generate(testData, 1, 0))
            .toThrow("Page size can not be less than or equal to zero");
    });

    testScenarios.forEach((theory: any) => {
        it(theory.scenario, () => {
            data = new ExtendedArray(theory.data);

            const sut = paginator.generate(data, theory.page, theory.pageSize);
            // // tslint:disable-next-line:no-console
            // console.log("Paginated data => ", sut);

            expect(sut.data).toBeTruthy();
            if (sut.data) {
                expect(sut.data.length).toBe(theory.expectedData.length);
            }
            expect(sut.page).toBe(theory.expectedPage);
            expect(sut.total).toBe(data.length);
            theory.expectedData.forEach((expectedtItem: number) => {
                expect(sut.data).toContain(expectedtItem);
            });
            expect(sut.previousPage).toBe(theory.expectedPreviousPage);
            expect(sut.nextPage).toBe(theory.expectedNextPage);
            expect(sut.lastPage).toBe(theory.expectedLastPage);
        });
    });
});
