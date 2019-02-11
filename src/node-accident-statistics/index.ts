import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

// import * as legacyAccident from "./src/middlewares/accidents/v1";
// import * as newAccident from "./src/middlewares/accidents/v2";

// initialize configuration
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT; // default port to listen

app.use(cors());

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configure session auth
// sessionAuth.register(app);

// define a route handler for the default home page
app.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // render the index template
  res.render("index");
});

app.get("/accidentsAPI", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // tslint:disable-next-line:no-console
  console.log("within accidents", req.query);
  res.render("accidentsAPI");
});

// app.use("/v1/accidents", legacyAccident.middleware;

// app.use("/v2/accidents", newAccident.middleware);

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});

export default app;
