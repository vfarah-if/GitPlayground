import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import * as accidentsAPISummary from "./accidents/apiSummaryRenderer";
import * as home from "./home/homeRenderer";

// initialize configuration
dotenv.config();

const app = express();

app.set("port", process.env.PORT || 9000);
app.set("env", process.env.NODE_ENV);

app.use(cors());

// Configure Express to use EJS
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../assets")));

app.get("/", home.renderer);
app.get("/accidentsAPISummary", accidentsAPISummary.renderer);

export default app;
