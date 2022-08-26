const logger = require("../utils/logger");

module.exports = function (err, req, res, next) {
  logger.log({ level: "error", message: err.message, err });
  res.status(500).send("Something has failed." + err);
};
