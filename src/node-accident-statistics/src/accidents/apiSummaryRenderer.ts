import { Request, Response } from "express";

/**
 * GET /accidentsAPISummary
 * Accident API summary page.
 */
export let renderer = (req: Request, res: Response) => {
  res.render("accidentsAPISummary");
};
