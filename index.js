const express = require("express");
const app = express();
const logger = require("./utils/logger");

require("./startup/loggin");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  logger.log({ level: "info", message: `Listening on port ${port}...` })
);
