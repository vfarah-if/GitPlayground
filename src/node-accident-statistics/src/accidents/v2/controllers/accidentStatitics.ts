import { NextFunction, Request, Response } from "express";
import { Collection, Db, MongoClient, MongoError } from "mongodb";
import { AccidentsQuery } from "../../../models/accidentsQuery";
import { ExtendedArray } from "./../../../arrays/extendedArray";
import { AccidentStatistic } from "./../../../models/accidentStatistic";
import { TransportForLondonClient } from "./../../v1/client/transportForLondonClient";

export const log = (message: string, ...args: any[]) => {
    // tslint:disable-next-line:no-console
    console.log(message, args);
};

/**
 * GET /v2/accidents
 * Accidents through a new mechanism page.
 */
export let accidents = (req: Request, res: Response) => {
    log("new accidents");
    let query = new AccidentsQuery();
    query = Object.assign(query, req.query);
    res.send(query);
};

/**
 * GET /v2/accidents/dataseed
 * Accidents through a new mechanism page.
 */
export let accidentsDataSeeder = (req: Request, res: Response, next: NextFunction) => {
    const url = `${process.env.MONGO_URL}/${process.env.MONGO_DB}`;
    log("Seeding data for ", url);
    const connectionOptions = { poolSize: 10, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000 };
    const client = new MongoClient(url, connectionOptions);
    client.connect()
        .then(async () => {
            if (client.isConnected()) {
                log("Connected and ready to create Connection");
                const db: Db = client.db(process.env.MONGO_DB);
                const collections = await db.collections();
                let collection = collections.find((item) => item.collectionName === process.env.MONGO_COLLECTION);
                if (collection) {
                    log(`Collection '${collection.collectionName}' exists`);
                } else {
                    createCollection(db, next);
                    collection = collections.find((item) => item.collectionName === process.env.MONGO_COLLECTION);
                }
                if (collection) {
                    const docCount = await collection.count();
                    if (docCount === 0) {
                        const maxYear = Number(process.env.MAX_YEAR);
                        for (let year = 2005; year <= maxYear; year++) {
                            const data = await getData(year);
                            cleanDataOf$Type(data);
                            insertMany(data, year, collection, next);
                        }
                    } else {
                        log(`'${docCount}' documents already exist`);
                    }
                } else {
                    next(new Error("Unable to create collection"));
                }
            }
            res.sendStatus(200);
        })
        .catch((error: MongoError) => {
            log(`Failed to connect to '${url}'. Please read README for using MongoDb`);
            next(error);
        });
};

function insertMany(
    data: ExtendedArray<AccidentStatistic>,
    year: number,
    collection: Collection<any>,
    next: NextFunction) {
    log(`Adding ${data.length} records for ${year}`);
    collection.insertMany(data, {
        forceServerObjectId: true
    }).then(() => {
        log(`Added ${data.length} records... `);
    }).catch((error: MongoError) => {
        next(error);
    });
}

function cleanDataOf$Type(data: ExtendedArray<AccidentStatistic>) {
    log(`Cleaning ${data.length} records of $ type... `);
    data.forEach((item) => {
        delete item.$type;
        if (item.vehicles) {
            item.vehicles.forEach((vehicle) => {
                delete vehicle.$type;
            });
        }
        if (item.casualties) {
            item.casualties.forEach((casualty) => {
                delete casualty.$type;
            });
        }
    });
}

async function getData(year: number): Promise<ExtendedArray<AccidentStatistic>> {
    const transportForLondonClient = new TransportForLondonClient();
    const from = new Date(`${year}-01-01`);
    const to = new Date(`${year}-12-31`);
    const result = await transportForLondonClient.loadAccidentStatisticsBetween(from, to);
    return result;
}

function createCollection(db: Db, next: NextFunction): void {
    db.createCollection(process.env.MONGO_COLLECTION as string)
        .then((newCollection) => {
            log(`Collection '${process.env.MONGO_COLLECTION}' created!`);
        })
        .catch((error: MongoError) => {
            next(error);
        });
}
