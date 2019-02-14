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

    public take(amount: number): ExtendedArray<T> {
        return new ExtendedArray<T>(this.filter((x, i) => {
            if (i <= (amount - 1)) {
                return true;
            }
        }));
    }

    public skip(amount: number): ExtendedArray<T> {
        return new ExtendedArray<T>(this.filter((x, i) => {
            if (i > (amount - 1)) {
                return true;
            }
        }));
    }
}
