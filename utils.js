const winston = require("winston");
const {DateTime} = require("luxon");
const { datadog } = require("./credentials.js");
const { createLogger, format, transports } = require('winston');
const base_url = require("./credentials").base_url;

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
}
const logger = createLogger({
  level: 'info',
  levels: customLevels.levels,
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Http(httpTransportOptions),
  ],
});

const commonMessages = {
  accessPage: "User Accessed a Page",
  restrictedPage: "Attempt at accessing restricted page"
}

function alertGeneral() {
  alert("Oops! An error has occurred. Please try again later. If this problem continues, please contact Vinniehat.");
}
function alertApplication() {
  alert("Oops! An error has occurred. Please make sure all fields that are required were filled in. If they were, you may have an application already waiting a response.");
}
const doesUserContainRoles = (userRoles, containsRoles) => {
  return userRoles.some(role => containsRoles.includes(role))
}

function applicationDivisionDisplay(division) {
  division = division.toLowerCase();
  if(division === "cgs") {
    return "Chryse Guard Security"
  } else if(division === "iceberg") {
    return "Iceberg Gaming"
  } else if(division === "17th") {
    return "17th Brigade Combat Team";
  }
}

function getCurrentDateISO() {
  return DateTime.local().setZone('America/Chicago').toISO();
}

module.exports = {
  logger,
  commonMessages,
  base_url,
  alertGeneral,
  doesUserContainRoles,
  applicationDivisionDisplay,
  getCurrentDateISO,
  alertApplication
}
