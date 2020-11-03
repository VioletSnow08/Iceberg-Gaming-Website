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
let datadog = {
  logger: {
    host: 'http-intake.logs.datadoghq.com',
    path: "/v1/input/b6b4c63a6b8eec338b8617ae9495e173?ddsource=nodejs&service=Iceberg Gaming Website-DEVOPS",
    ssl: true
  }
}
module.exports = {
  firebaseConfig,
  datadog
}
