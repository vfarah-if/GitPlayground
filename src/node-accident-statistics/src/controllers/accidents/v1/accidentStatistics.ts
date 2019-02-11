import { Request, Response } from "express";

/**
 * GET /v1/accidents
 * Accidents through the live tfl page.
 */
export let accidents = (req: Request, res: Response) => {
    // tslint:disable-next-line:no-console
    console.log("legacy accidents");
    res.send(req.query);
};
