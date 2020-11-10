const express = require('express')
const firebase = require("firebase");
const {mysql, firebaseConfig, jwt_secret} = require("../credentials");
let MYSQL = require("mysql");
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express()
const port = 3001


let con = MYSQL.createConnection({
  ...mysql
})


firebase.initializeApp(firebaseConfig);
app.use(cookieParser());
app.use(cors({origin: true, credentials: true}));
app.set('firebase', firebase);
app.set('con', con);
app.set('jwt', jwt);
app.use(express.static(path.join(__dirname, '../dist')));
let bodyParser = require('body-parser')
app.use(bodyParser.json());

// API Modules
app.use('/api/v1/user/', require('./modules/user').router);



// app.get('*', (req,res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports.verifyToken = {

}
