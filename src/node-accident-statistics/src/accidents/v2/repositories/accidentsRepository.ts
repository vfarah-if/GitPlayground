import { Collection, Db, MongoClient, MongoError } from "mongodb";
import {
    AccidentStatistic,
    Paging,
    SortByOptions
} from "../../../models";
import { ExtendedArray } from "./../../../arrays/extendedArray";

export class AccidentsRepository {

    constructor(private collection: Collection<AccidentStatistic>) { }

    public async get(from: Date,
                     to: Date,
                     severity: string,
                     sortBy: SortByOptions,
                     page: number,
                     pageSize: number): Promise<Paging<AccidentStatistic>> {

        const total = await this.count(
            new Date(from),
            new Date(to),
            severity);
        const maxPageCount = Math.ceil(total / pageSize);
        // tslint:disable-next-line:no-console
        console.log("Max Page Count ", maxPageCount);
        let zeroIndexedCurrentPage = page - 1;

        if (zeroIndexedCurrentPage < 0) {
            zeroIndexedCurrentPage = 0;
        }

        if (maxPageCount > 0 && page >= maxPageCount) {
            zeroIndexedCurrentPage = maxPageCount - 1;
        }

        const skip = zeroIndexedCurrentPage * pageSize;
        const sort = this.getMongoSort(sortBy);

        const data = await this.collection.find({
            $and: [
                { date: { $gte: new Date(from) } },
                { date: { $lte: new Date(to) } }
            ],
            severity
        })
            // TODO: Sort
            .sort(sort)
            .skip(skip)
            .limit(pageSize);

        const result = new Paging();
        const asArray = await data.toArray();
        return result.create(
            asArray,
            zeroIndexedCurrentPage + 1,
            total,
            maxPageCount);
    }

    public async count(from: Date, to: Date, severity: string): Promise<number> {
        return await this.collection.countDocuments({
            $and: [
                { date: { $gte: new Date(from) } },
                { date: { $lte: new Date(to) } }
            ],
            severity
        });
    }

    private getMongoSort(sortBy: SortByOptions): any {
        let result = { date: -1 };
        switch (sortBy.toLowerCase()) {
            case "dateascending":
                result = { date: 1 };
                break;
            case "datedescending":
            default:
                break;
        }
        return result;
    }
}
