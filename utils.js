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
const doesUserContainRoles = (userRoles, containsRoles) => {
  return userRoles.some(role => containsRoles.includes(role))
}

function applicationDivisionDisplay(division) {
  if(division === "CGS") {
    return "Chryse Guard Security"
  } else if(division === "Iceberg") {
    return "Iceberg Gaming"
  } else if(division === "17th") {
    return "17th Brigade Combat Team";
  }
}

const data = {
  discord: "https://discord.gg/7hDQCEb",
  teamspeak: "ts3server://ts.iceberg-gaming.com/?port=9987",
  bct_modpack: "https://steamcommunity.com/sharedfiles/filedetails/?id=1501538330"
}
function getCurrentDateISO() {
  let createdAt = DateTime.local().setZone('America/Chicago').toISO();
  return createdAt;
}

module.exports = {
  logger,
  commonMessages,
  base_url,
  alertGeneral,
  doesUserContainRoles,
  applicationDivisionDisplay,
  data,
  getCurrentDateISO
}
