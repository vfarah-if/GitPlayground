import errorHandler from "errorhandler";
import app from "./app";

import * as v1AccidentsController from "./accidents/v1/controllers/accidentStatistics";
import * as v2AccidentsController from "./accidents/v2/controllers/accidentStatitics";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Accidents API.
 */
app.get("/v1/accidents", v1AccidentsController.accidents);
app.get("/v2/accidents", v2AccidentsController.accidents);

/**
 * Start Express server.
 */
// Hack: https://blog.campvanilla.com/jest-expressjs-and-the-eaddrinuse-error-bac39356c33a
if (process.env.NODE_ENV !== "test") {
  app.listen(app.get("port"), () => {
    // tslint:disable-next-line:no-console
    console.log(
      "  App is running at http://localhost:%d in %s mode",
      app.get("port"),
      app.get("env")
    );
    // tslint:disable-next-line:no-console
    console.log("  Press CTRL-C to stop\n");
  });
}

export default app;
