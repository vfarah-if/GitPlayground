import { ExtendedArray } from "./../../src/arrays/extendedArray";

// tslint:disable-next-line:interface-name
interface People {
    firstName: string;
    lastName: string;
    age: number;
    dob: Date;
}

describe("ExtendedArray", () => {
    let numberArray: ExtendedArray<number>;
    let peopleArray: ExtendedArray<People>;

    beforeEach(() => {
        numberArray = new ExtendedArray<number>([2, 1, 3, 4, 5, 7, 6, 8, 9, 10]);
        peopleArray = new ExtendedArray<People>([
            { firstName: "Samuel", lastName: "Farah", age: 9, dob: new Date("2009-11-22") },
            { firstName: "Gabriel", lastName: "Farah", age: 5, dob: new Date("2014-01-04") },
        ]);
    });

    it("should create test lists as expected", () => {
        expect(numberArray).toBeTruthy();
        expect(numberArray.length).toBe(10);
        expect(peopleArray).toBeTruthy();
        expect(peopleArray.length).toBe(2);
    });

    it("should sort the list descending", () => {
        numberArray.descending();
        // tslint:disable-next-line:no-console
        console.log("Numbers are =>", numberArray);
        expect(numberArray[0]).toBe(10);
        expect(numberArray[4]).toBe(6);
        expect(numberArray[9]).toBe(1);
    });

    it("should sort the list ascending", () => {
        numberArray.ascending();
        // tslint:disable-next-line:no-console
        console.log("Numbers are =>", numberArray);
        expect(numberArray[0]).toBe(1);
        expect(numberArray[4]).toBe(5);
        expect(numberArray[9]).toBe(10);
    });

    it("should sort and skip 5 and return the remainer 5", () => {
        numberArray = numberArray.asc().skip(5);
        // tslint:disable-next-line:no-console
        console.log("Numbers are =>", numberArray);
        expect(numberArray.length).toBe(5);
        expect(numberArray[0]).toBe(6);
        expect(numberArray[1]).toBe(7);
        expect(numberArray[2]).toBe(8);
        expect(numberArray[3]).toBe(9);
        expect(numberArray[4]).toBe(10);
    });

    it("should sort and skip 5 and take 2", () => {
        numberArray = numberArray.asc().skip(5).take(2);
        // tslint:disable-next-line:no-console
        console.log("Numbers are =>", numberArray);
        expect(numberArray.length).toBe(2);
        expect(numberArray[0]).toBe(6);
        expect(numberArray[1]).toBe(7);
    });

    it("should sort and query for only even numbers", () => {
        numberArray = numberArray.asc().query((x: number) => x % 2 === 0);
        // tslint:disable-next-line:no-console
        console.log("Numbers are =>", numberArray);
        expect(numberArray.length).toBe(5);
        expect(numberArray[0]).toBe(2);
        expect(numberArray[1]).toBe(4);
        expect(numberArray[2]).toBe(6);
        expect(numberArray[3]).toBe(8);
        expect(numberArray[4]).toBe(10);
    });

    it("should sort by age ascending and descending", () => {
        peopleArray.ascending((x: People) => x.age);
        // tslint:disable-next-line:no-console
        console.log("Age asc =>", peopleArray);
        expect(peopleArray.length).toBe(2);
        expect(peopleArray[0].age).toBe(5);
        expect(peopleArray[1].age).toBe(9);

        peopleArray.descending((x: People) => x.age);
        // tslint:disable-next-line:no-console
        console.log("Age desc =>", peopleArray);
        expect(peopleArray.length).toBe(2);
        expect(peopleArray[0].age).toBe(9);
        expect(peopleArray[1].age).toBe(5);
    });

    it("should sort by dob ascending and descending", () => {
        peopleArray.descending((x: People) => x.dob);
        // tslint:disable-next-line:no-console
        console.log("DOB desc =>", peopleArray);
        expect(peopleArray.length).toBe(2);
        expect(peopleArray[0].age).toBe(5);
        expect(peopleArray[1].age).toBe(9);

        peopleArray.ascending((x: People) => x.dob);
        // tslint:disable-next-line:no-console
        console.log("DOB asc =>", peopleArray);
        expect(peopleArray.length).toBe(2);
        expect(peopleArray[0].age).toBe(9);
        expect(peopleArray[1].age).toBe(5);
    });

    it("should sort by firstName ascending and descending", () => {
        peopleArray.desc((x: People) => x.firstName);
        // tslint:disable-next-line:no-console
        console.log("firstName desc =>", peopleArray);
        expect(peopleArray.length).toBe(2);
        expect(peopleArray[0].firstName).toBe("Samuel");
        expect(peopleArray[1].firstName).toBe("Gabriel");

        peopleArray.asc((x: People) => x.firstName);
        // tslint:disable-next-line:no-console
        console.log("firstName asc =>", peopleArray);
        expect(peopleArray.length).toBe(2);
        expect(peopleArray[0].firstName).toBe("Gabriel");
        expect(peopleArray[1].firstName).toBe("Samuel");
    });

    it("should query complex object for string value", () => {
        peopleArray = peopleArray.query((x: People) => x.firstName === "Samuel");
        // tslint:disable-next-line:no-console
        console.log("query firstname = Samuel =>", peopleArray);
        expect(peopleArray.length).toBe(1);
        expect(peopleArray[0].firstName).toBe("Samuel");
    });
});
