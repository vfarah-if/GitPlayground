export function guardToDate(to: Date, maxYear: number) {
    if (to && to.getFullYear() < 2005) {
        raiseDataBelow2005();
    }
    if (to && to.getFullYear() > maxYear) {
        raiseMaxYearNotSupported(maxYear);
    }
}

export function guardFromDate(from: Date, maxYear: number) {
    if (from && from.getFullYear() < 2005) {
        raiseDataBelow2005();
    }
    if (from && from.getFullYear() > maxYear) {
        raiseMaxYearNotSupported(maxYear);
    }
}

function raiseDataBelow2005() {
    throw new Error("No data below 2005");
}

function raiseMaxYearNotSupported(maxYear: number) {
    throw new Error(`No data greater than '${maxYear}'`);
}
