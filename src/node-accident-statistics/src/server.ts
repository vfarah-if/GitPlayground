import apicache from "apicache";
import errorHandler from "errorhandler";
import * as v1AccidentsController from "./accidents/v1/controllers/accidentStatistics";
import * as v2AccidentsController from "./accidents/v2/controllers/accidentStatitics";
import app from "./app";
import { log } from "./logger";

const cache = apicache.middleware;
const onlyStatus200 = (req: any, res: any) => res.statusCode === 200;

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Accidents API.
 */
log(`Cache API for ${process.env.CACHE_DURATION} only for status 200 on PORT ${process.env.PORT} for
  ${process.env.NODE_ENV}`);
app.get("/v1/accidents", cache(process.env.CACHE_DURATION, onlyStatus200), v1AccidentsController.accidents);
app.get("/v2/accidents", cache(process.env.CACHE_DURATION, onlyStatus200), v2AccidentsController.accidents);
app.get("/v2/accidents/seedData", v2AccidentsController.accidentsDataSeeder);
app.get("/v2/accidents/dropdb", v2AccidentsController.accidentsDeleteDb);

/**
 * Start Express server.
 */
// Hack: https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
if (process.env.NODE_ENV !== "test") {
  app.listen(app.get("port"), () => {
    log(
      "  App is running at http://localhost:%d in %s mode",
      app.get("port"),
      app.get("env")
    );
    log("  Press CTRL-C to stop\n");
  });
}

export default app;
