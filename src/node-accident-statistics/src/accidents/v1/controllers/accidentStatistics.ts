import { Request, Response } from "express";
import { AccidentsQuery } from "../../../models/accidentsQuery";

/**
 * GET /v1/accidents
 * Accidents through the live tfl page.
 */
export let accidents = (req: Request, res: Response) => {
    // tslint:disable-next-line:no-console
    console.log("legacy accidents");
    let query = new AccidentsQuery();
    query = Object.assign(query, req.query);
    res.send(query);
};
