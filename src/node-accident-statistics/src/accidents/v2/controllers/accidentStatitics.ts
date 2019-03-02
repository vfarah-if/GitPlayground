import { NextFunction, Request, Response } from "express";
import { Collection, Db, MongoClient, MongoError } from "mongodb";
import { log } from "../../../logger";
import { AccidentsQuery, AccidentStatistic } from "../../../models";
import { ExtendedArray } from "./../../../arrays/extendedArray";
import { TransportForLondonClient } from "./../../v1/client/transportForLondonClient";
import { AccidentsRepository } from "./../repositories/accidentsRepository";

/**
 * GET /v2/accidents
 * Accidents through a new mechanism page.
 */
export let accidents = async (req: Request, res: Response, next: NextFunction) => {
    let query = new AccidentsQuery();
    query = Object.assign(query, req.query);
    log("Accidents filtered by => ", query);
    const collection = await getAccidentStatisticsCollection();
    if (collection) {
        const repository = new AccidentsRepository(collection);
        repository.get(
            new Date(query.from),
            new Date(query.to),
            query.severity,
            query.sortBy,
            Number(query.page),
            Number(query.pageSize))
            .then((data) => res.send(data))
            .catch((error) => next(error));
    } else {
        next(new Error("Collection could not be found"));
    }
};

/**
 * GET /v2/accidents/dataseed
 * Seed data from the live site from a query parameter or
 */
export let accidentsDataSeeder = (req: Request, res: Response, next: NextFunction) => {
    const client = createClient();
    let collectionCreated = false;
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
                    collection = await createCollection(db, next);
                    log(`Collection '${process.env.MONGO_COLLECTION}' created!`);
                    collectionCreated = true;
                }
                if (collection) {
                    const docCount = await collection.countDocuments();
                    if (docCount === 0) {
                        const maxYear = Number(process.env.MAX_YEAR);
                        const fromYear = req.query.from || 2005;
                        for (let year = Number(fromYear); year <= maxYear; year++) {
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
            if (collectionCreated) {
                res.sendStatus(201);
            } else {
                res.sendStatus(200);
            }
        })
        .catch((error: MongoError) => {
            log(`Failed to connect. Please read README for using MongoDb`);
            next(error);
        });
};

/**
 * GET /v2/accidents/dropdb
 * Accidents through a new mechanism page.
 */
export let accidentsDeleteDb = (req: Request, res: Response, next: NextFunction) => {
    const client = createClient();
    client.connect()
        .then(async () => {
            if (client.isConnected()) {
                log("Connected and ready to to connect to collection");
                const db: Db = client.db(process.env.MONGO_DB);
                await db.dropDatabase();
                log("Successfullly dropped db", db.databaseName);
                res.sendStatus(202);
                // NOTE: Should be 204 but the UI does not respond to no content, so accepted it is
                // res.sendStatus(204);
            } else {
                next(new Error("Unable to drop the database"));
            }
        })
        .catch((error: MongoError) => {
            log(`Failed to drop the database`);
            next(error);
        });
};

function createClient(): MongoClient {
    const url = `${process.env.MONGO_URL}/${process.env.MONGO_DB}`;
    log("Connecting to", url);
    const connectionOptions = {
        poolSize: 10,
        reconnectInterval: 1000,
        reconnectTries: Number.MAX_VALUE,
        useNewUrlParser: true
    };
    const client = new MongoClient(url, connectionOptions);
    return client;
}

async function getAccidentStatisticsCollection(): Promise<Collection<AccidentStatistic> | undefined> {
    let client = createClient();
    client = await client.connect();
    if (client.isConnected) {
        const db: Db = client.db(process.env.MONGO_DB);
        const collections = await db.collections();
        return collections.find((item) => {
            return item.collectionName === process.env.MONGO_COLLECTION;
        });
    }
    return undefined;
}

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
        if (item.date) {
            item.date = new Date(item.date);
        }

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

function createCollection(db: Db, next: NextFunction): Promise<Collection<any>> {
    return db.createCollection(process.env.MONGO_COLLECTION as string);
}
