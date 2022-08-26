const logger = require("../utils/logger");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    looger.log({ level: "error", message: ex.message });
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    looger.log({ level: "error", message: ex.message });
    process.exit(1);
  });
};
