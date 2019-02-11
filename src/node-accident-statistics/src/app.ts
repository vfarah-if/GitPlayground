import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import * as accidentsAPIController from "./controllers/accidentsAPI";
import * as homeController from "./controllers/home";

// initialize configuration
dotenv.config();

const app = express();

app.set("port", process.env.PORT || 9000);

app.use(cors());

// Configure Express to use EJS
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.get("/", homeController.index);
app.get("/accidentsAPI", accidentsAPIController.accidentsAPI);

export default app;
