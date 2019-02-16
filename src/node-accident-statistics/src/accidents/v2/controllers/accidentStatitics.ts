import { NextFunction, Request, Response } from "express";
import { Db, MongoClient, MongoError } from "mongodb";
import { AccidentsQuery } from "../../../models/accidentsQuery";
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
 * GET /v2/accidents
 * Accidents through a new mechanism page.
 */
export let accidentsDataSeeder = (req: Request, res: Response, next: NextFunction) => {
    const url = `${process.env.MONGO_URL}/${process.env.MONGO_DB}`;
    log("Seeding data for ", url);
    const client = new MongoClient(url, { poolSize: 10, reconnectTries: Number.MAX_VALUE, reconnectInterval: 1000 });
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
                    db.createCollection(process.env.MONGO_COLLECTION as string)
                        .then((newCollection) => {
                            log(`Collection '${process.env.MONGO_COLLECTION}' created!`);
                            collection = newCollection;
                        })
                        .catch((error: MongoError) => {
                            next(error);
                        });
                }
                const transportForLondonClient = new TransportForLondonClient();
                const query = new AccidentsQuery();
                query.from = new Date("2017-01-01");
                const data = await transportForLondonClient.loadAccidentStatisticsBetween(query.from, query.to as Date);
                log(`Adding ${data.length} records... `);
                collection = collections.find((item) => item.collectionName === process.env.MONGO_COLLECTION);
                if (collection) {
                    // collection.bulkWrite(data)
                    collection.insertMany(data, {
                        bypassDocumentValidation: true,
                        forceServerObjectId: true,
                        serializeFunctions: true
                    }).then(() => {
                        log(`Added ${data.length} records... `);
                    }).catch((error) => {
                        next(error);
                    });
                }
            }
            res.sendStatus(200);
        })
        .catch((error: MongoError) => {
            log(`Failed to connect to '${url}'. Please read README for using MongoDb`);
            next(error);
        })
        .finally(() => {
            // client.close();
        });
};
