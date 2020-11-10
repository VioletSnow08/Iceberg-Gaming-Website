const winston = require("winston");
const { datadog } = require("./credentials.js");
const { createLogger, format, transports } = require('winston');
const base_url = "http://localhost:3001/api/v1"
require("setimmediate");

// Winston ~
const httpTransportOptions = {
  host: datadog.logger.host,
  path: datadog.logger.path,
  ssl: datadog.logger.ssl
};
const customLevels = {
  levels: {
    emergency: 0,
    alert: 1,
    critical: 2,
    error: 3,
    warn: 4,
    notice: 5,
    info: 6,
    debug: 7,
    success: 8
  },
  // colors: {
  //   emergency: "red",
  //   alert: "red",
  //   critical: "red",
  //   error: "red",
  //   warn: "yellow",
  //   notice: "magenta",
  //   info: "blue",
  //   debug: "gray",
  //   success: "green"
  // }
}
// winston.addColors(customLevels.colors);
const logger = createLogger({
  level: 'info',
  levels: customLevels.levels,
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Http(httpTransportOptions),
  ],
});

const alertWarn = function(text) {
  if(text == 0) {
    text = "Oops. An error occurred. Vincent Lauro will be reaching out to you shortly."
  }
  alert(text);
}

const commonMessages = {
  accessPage: "User Accessed a Page",
  restrictedPage: "Attempt at accessing restricted page"
}

module.exports = {
  logger,
  alertWarn,
  commonMessages,
  base_url
}

