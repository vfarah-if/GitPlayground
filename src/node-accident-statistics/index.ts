import dotenv from "dotenv";
import express from "express";
import path from "path";
import * as mssql from "mssql";

// initialize configuration
dotenv.config();

const app = express();
const port = process.env.SERVER_PORT; // default port to listen

// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Configure session auth
// sessionAuth.register(app);

// define a route handler for the default home page
app.get("/", (req: express.Request, res: express.Response) => {
  // render the index template
  res.render("index");
});

app.get("/accidents", (req: express.Request, res: express.Response) => {
  res.render("accidents");
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

// start the express server
app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
