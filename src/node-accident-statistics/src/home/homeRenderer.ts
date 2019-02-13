import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export let renderer = (req: Request, res: Response) => {
    res.render("index");
};
