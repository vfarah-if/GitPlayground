import errorHandler from "errorhandler";
import app from "./app";

import * as legacyAccidentsController from "./controllers/accidents/v1/accidentStatistics";
import * as newAccidentsController from "./controllers/accidents/v2/accidentStatitics";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Accidents API.
 */
app.get("/v1/accidents", legacyAccidentsController.accidents);
app.get("/v2/accidents", newAccidentsController.accidents);

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
  // tslint:disable-next-line:no-console
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  // tslint:disable-next-line:no-console
  console.log("  Press CTRL-C to stop\n");
});

export default server;
