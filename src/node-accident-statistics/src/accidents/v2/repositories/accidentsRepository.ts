import { Collection } from "mongodb";
import {
    AccidentStatistic,
    Paging,
    SortByOptions
} from "../../../models";
import { log } from "./../../../logger";
import { ascending, descending } from "./../../../sort";
import { guardFromDate, guardToDate } from "./../../shared/validation";

// tslint:disable-next-line:interface-name
interface MongoSortOption {
    keyOrList: string | Array<{}> | {};
    direction?: number;
}

export class AccidentsRepository {

    constructor(private collection: Collection<AccidentStatistic>) { }

    public async get(from: Date,
                     to: Date,
                     severity: string,
                     sortBy: SortByOptions,
                     page: number,
                     pageSize: number): Promise<Paging<AccidentStatistic>> {

        const maxYear = Number(process.env.MAX_YEAR);
        guardFromDate(from, maxYear);
        guardToDate(to, maxYear);
        if (from > to) {
            const temp = from;
            from = to;
            to = temp;
        }

        const total = await this.count(
            new Date(from),
            new Date(to),
            severity);
        const maxPageCount = Math.ceil(total / pageSize);
        log("Max Page Count ", maxPageCount);
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
            .sort(sort.keyOrList, sort.direction)
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

    private getMongoSort(sortBy: SortByOptions): MongoSortOption {
        let result: MongoSortOption = { keyOrList: "date", direction: descending };
        switch (sortBy.toLowerCase()) {
            case "locationascending":
                result = { keyOrList: "location", direction: ascending };
                break;
            case "locationdescending":
                result = { keyOrList: "location", direction: descending };
                break;
            case "boroughascending":
                result = { keyOrList: "borough", direction: ascending };
                break;
            case "boroughdescending":
                result = { keyOrList: "borough", direction: descending };
                break;
            case "tflidascending":
                result = { keyOrList: "id", direction: ascending };
                break;
            case "tfliddescending":
                result = { keyOrList: "id", direction: descending };
                break;
            case "accidentstatisticidascending":
                result = { keyOrList: "_id", direction: ascending };
                break;
            case "accidentstatisticiddescending":
                result = { keyOrList: "_id", direction: descending };
                break;
            case "dateascending":
                result = { keyOrList: "date", direction: ascending };
                break;
            case "datedescending":
            default:
                break;
        }
        log("Sorting => ", result);
        return result;
    }
}
