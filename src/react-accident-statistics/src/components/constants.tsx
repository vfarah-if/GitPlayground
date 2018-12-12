export const DEFAULT_FROM_DATE: Date = new Date(2010, 1, 1);
export const sleep = async ms => ms
    ? new Promise(resolve => setTimeout(resolve, ms))
    : new Promise(resolve => setImmediate(resolve));