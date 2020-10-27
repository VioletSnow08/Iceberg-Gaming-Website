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
const logger = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Http(httpTransportOptions),
  ],
});

module.exports = {
  firebaseConfig,
  logger
}

