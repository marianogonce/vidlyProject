const mongoose = require("mongoose");
const logger = require("../utils/logger");
const config = require("config");
const { ServerApiVersion } = require("mongodb");

module.exports = function () {
  mongoose
    .connect(config.get("db"), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() =>
      logger.log({ level: "info", message: "Connected  to mongoDB..." })
    );
};
