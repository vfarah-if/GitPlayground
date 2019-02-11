import { Request, Response } from "express";
// import * as mssql from "mssql";

/**
 * GET /v2/accidents
 * Accidents through a new mechanism page.
 */
export let accidents = (req: Request, res: Response) => {
    // tslint:disable-next-line:no-console
    console.log("new accidents");
    res.send(req.query);
};

// app.get("/v2/accidents", (req: express.Request, res: express.Response) => {
//   let sql = mssql;
//   let db;
//   const connect = () => {
//     return new Promise((resolve, reject) => {
//       db = sql.ConnectionPool(process.env.CONNECTION_STRING as string, err => {
//         if (err) {
//           console.error("Connection failed.", err);
//           reject(err);
//         } else {
//           console.log("Connected to database");
//           resolve();
//         }
//       });
//     });
//   };
// });
