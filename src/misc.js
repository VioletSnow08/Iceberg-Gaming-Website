const winston = require("winston");

const { createLogger, format, transports } = require('winston');
require("setimmediate");

let firebaseConfig = {
  apiKey: 'AIzaSyA8e8TdgtWnNYl86HV3joSTOy-19h3Y3TQ',
  authDomain: 'seventeenth-bct.firebaseapp.com',
  databaseURL: 'https://seventeenth-bct.firebaseio.com',
  projectId: 'seventeenth-bct',
  storageBucket: 'seventeenth-bct.appspot.com',
  messagingSenderId: '682700854607',
  appId: '1:682700854607:web:ca34e54af9128afb82e13a',
  measurementId: 'G-XS6SPLLTV2'
};

// Winston ~
const httpTransportOptions = {
  host: 'http-intake.logs.datadoghq.com',
  path: "/v1/input/b6b4c63a6b8eec338b8617ae9495e173?ddsource=nodejs&service=Iceberg Gaming Website-DEVOPS",
  ssl: true
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

module.exports = {
  firebaseConfig,
  logger,
  alertWarn
}

