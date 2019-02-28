import { Collection, Db, MongoClient, MongoError } from "mongodb";
import {
    AccidentStatistic,
    Paging,
    SortByOptions
} from "../../../models";

export class AccidentsRepository {

    constructor(private collection: Collection<AccidentStatistic>) {
    }

    // public async get(from: Date,
    //     to: Date,
    //     severity: string,
    //     sortBy: SortByOptions,
    //     page: number,
    //     pageSize: number): Promise<Paging<AccidentStatistic>> {
    //     throw new Error("not implemented");
    // }

    public async count(from: Date,
                       to: Date,
                       severity: string,
                       sortBy: SortByOptions,
                       page: number,
                       pageSize: number): Promise<number> {
        return await this.collection.countDocuments({
            $and: [
                { date: { $gte: new Date(from) } },
                { date: { $lte: new Date(to) } }
            ],
            severity
        });
    }
}
