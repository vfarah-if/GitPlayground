export const log = (message: string, ...args: any[]) => {
    if (args && args.length > 0) {
        // tslint:disable-next-line:no-console
        console.log(message, args);
    } else {
        // tslint:disable-next-line:no-console
        console.log(message);
    }
};
