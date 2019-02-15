import { ascending, compare, compareBy, descending } from "./../sort";

/* Remarks : Create the ability to skip, take, query and sort on a normal array as a fluent extension,
**     faster than lodash utilising the internal sort function with a comparer, taking it closer to
**     the native JS speed
*/

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

    public ascending(sortBy?: any): void {
        if (sortBy) {
            this.sort((a, b) => compareBy(sortBy, ascending, a, b));
        } else {
            this.sort((a, b) => compare(ascending, a, b));
        }
    }

    public asc(sortBy?: any): ExtendedArray<T> {
        this.ascending(sortBy);
        return new ExtendedArray<T>(this);
    }

    public descending(sortBy?: any): void {
        if (sortBy) {
            this.sort((a, b) => compareBy(sortBy, descending, a, b));
        } else {
            this.sort((a, b) => compare(descending, a, b));
        }
    }

    public desc(sortBy?: any): ExtendedArray<T> {
        this.descending(sortBy);
        return new ExtendedArray<T>(this);
    }
}
