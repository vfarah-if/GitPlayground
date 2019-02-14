
// tslint:disable-next-line:interface-name
export class Paging<T> {
    public data?: T[];
    public lastPage?: number;
    public nextPage?: number;
    public page?: number;
    public previousPage?: number;
    public pageSize?: number;
    public total?: number;
}
