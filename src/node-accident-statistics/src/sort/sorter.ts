export const ascending = 1;
export const descending = -1;
export type sortDirection = 1 | -1;

export const compare = (direction: sortDirection, a: any, b: any): number => {
    if (a === b) { return 0; }
    if (a < b) { return -direction; }
    if (a == null) { return 1; }
    if (b == null) { return -1; }
    return direction;
};

export const compareBy = (sortBy: any, direction: sortDirection, a: any, b: any): number => {
    return compare(direction, sortBy(a), sortBy(b));
};
