import express from "express";

const app = express();

app.get("/v1/accidents", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // tslint:disable-next-line:no-console
    console.log("legacy accidents");
    res.send(req.query);
  });

module.exports = app;
