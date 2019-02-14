import { ascending, compareBy, descending } from "./../sort";

// Remarks : Create the ability to skip and take on a normal array as a fluent extension
export class ExtendedArray<T> extends Array<T> {
    public constructor(items?: T[]) {
        super();
        if (items) {
            items.forEach((item) => {
                this.push(item);
            });
        }
    }

    public query(callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): ExtendedArray<T> {
        return new ExtendedArray<T>(this.filter(callbackfn));
    }

    public take(amount: number): ExtendedArray<T> {
        return this.query((x, i) => {
            if (i <= (amount - 1)) {
                return true;
            }
        });
    }

    public skip(amount: number): ExtendedArray<T> {
        return this.query((x, i) => {
            if (i > (amount - 1)) {
                return true;
            }
        });
    }

    public ascending(sortBy: any): void {
        this.sort((a, b) => compareBy(sortBy, ascending, a, b));
    }

    public descending(sortBy: any): void  {
        this.sort((a, b) => compareBy(sortBy, descending, a, b));
    }
}
