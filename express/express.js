const express = require('express')
const firebase = require("firebase");
const {mysql, firebaseConfig} = require("../credentials");
let MYSQL = require("mysql");
const path = require('path');

const app = express()
const port = 3000


let con = MYSQL.createConnection({
  ...mysql
})


firebase.initializeApp(firebaseConfig);


app.use(express.static(path.join(__dirname, '../dist')));
// API Modules


// app.get('*', (req,res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
