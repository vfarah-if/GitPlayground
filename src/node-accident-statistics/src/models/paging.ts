import _ from "lodash";

// tslint:disable-next-line:interface-name
export class Paging<T> {
    public data?: T[];
    public lastPage?: number;
    public nextPage?: number;
    public page?: number;
    public previousPage?: number;
    public pageSize?: number;
    public total?: number;

    // public static generate(allData: T[], pageSize: number, page: number): Paging<T> {
    //     // TODO: Validate the data being passed in
    //     const total = allData.length;
    //     const maxPageCount = total % pageSize != 0
    //         ? total / pageSize + 1
    //         : total / pageSize;
    //     let zeroIndexedCurrentPage = page - 1;

    //     if (zeroIndexedCurrentPage < 0) {
    //         zeroIndexedCurrentPage = 0;
    //     }

    //     if (maxPageCount > 0 && page >= maxPageCount) {
    //         zeroIndexedCurrentPage = maxPageCount - 1;
    //     }

    //     const skip = zeroIndexedCurrentPage * pageSize;
    //     const data = allData.Skip(skip).Take(pageSize);
    // }
}
