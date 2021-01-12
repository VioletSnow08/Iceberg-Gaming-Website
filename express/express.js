const express = require('express')
const {mysql, firebaseConfig, jwt_secret} = require("../credentials");
let MYSQL = require("promise-mysql");
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require("fs")
require( 'trace-unhandled/register' )

const app = express()
const port = 3001

MYSQL.createConnection({
  ...mysql
}).then(function (con) {


  app.use(cookieParser());
  app.use(cors({origin: true, credentials: true}));
  app.set('jwt', jwt);
  app.set('con', con);
  app.use(express.static(path.join(__dirname, '../dist')));
  let bodyParser = require('body-parser')
  app.use(bodyParser.json());

// API Modules
  app.use('/api/v1/user', require('./v1-modules/user').router);
  app.use('/api/v1/settings', require('./v1-modules/settings').router);
  app.use('/api/v1/applications', require('./v1-modules/Applications/applications').router);
  app.use('/api/v1/user-management', require('./v1-modules/User Management/user-management').router);
  app.use('/api/v1/administrative', require('./v1-modules/Administrative/administrative').router);
  app.use('/api/v1/channels', require('./v1-modules/channels').router);

  fs.access("../dist", function (error) {
    if (error) {
      console.log("Directory does not exist. Running in development mode...")
    } else {
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
      });
    }
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}).catch(error => {
  if (error) throw error;
})
