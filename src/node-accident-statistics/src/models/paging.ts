import { ExtendedArray } from "./../arrays/extendedArray";

export class Paging<T> {

    public data?: T[];
    public lastPage?: number;
    public nextPage?: number;
    public page?: number;
    public previousPage?: number;
    public pageSize?: number;
    public total?: number;

    public generate(allData: ExtendedArray<T>, page: number, pageSize: number): Paging<T> {
        if (!allData) {
            throw new Error("Data is required for pagination");
        }

        if (pageSize <= 0) {
            throw new Error("Page size can not be less than or equal to zero");
        }
        const total = allData.length;
        const maxPageCount = Math.ceil(total / pageSize);
        let zeroIndexedCurrentPage = page - 1;

        if (zeroIndexedCurrentPage < 0) {
            zeroIndexedCurrentPage = 0;
        }

        if (maxPageCount > 0 && page >= maxPageCount) {
            zeroIndexedCurrentPage = maxPageCount - 1;
        }

        const skip = zeroIndexedCurrentPage * pageSize;
        const data = allData.skip(skip).take(pageSize);
        const result = new Paging<T>();
        result.data = data;
        result.page = zeroIndexedCurrentPage + 1;
        result.total = total;
        result.pageSize = data.length;
        result.lastPage = maxPageCount;
        if (result.page && result.lastPage && result.page < result.lastPage) {
            result.nextPage = result.page + 1;
        }
        if (result.page && result.page > 1) {
            result.previousPage = result.page - 1;
        }
        return result;
    }
}
