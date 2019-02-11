import express from "express";
// import * as mssql from "mssql";

const app = express();

app.get("/v2/accidents", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // tslint:disable-next-line:no-console
  console.log("new accidents");
  res.send(req.query);
});

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

module.exports = app;
