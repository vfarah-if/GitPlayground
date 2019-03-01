import { NextFunction, Request, Response } from "express";
import { AccidentsQuery } from "../../../models/accidentsQuery";
import { TransportForLondonClient } from "../client/transportForLondonClient";

const transportForLondonClient = new TransportForLondonClient();

/**
 * GET /v1/accidents
 * Accidents through the live tfl page.
 */
export let accidents = (req: Request, res: Response, next: NextFunction) => {
    // tslint:disable-next-line:no-console
    console.log("legacy accidents");
    let query = new AccidentsQuery();
    query = Object.assign(query, req.query);
    transportForLondonClient.getAccidentStatisticsByQuery(query)
        .then((result) => {
            res.send(result);
        }).catch((error) => {
            // tslint:disable-next-line:no-console
            console.error("Unable to get statistics data from the Service", error);
            next(error);
        });
};
