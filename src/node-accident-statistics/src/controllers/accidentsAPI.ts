import { Request, Response } from "express";

/**
 * GET /accidentsAPI
 * Accident API summary page.
 */
export let accidentsAPI = (req: Request, res: Response) => {
  res.render("accidentsAPI");
};
