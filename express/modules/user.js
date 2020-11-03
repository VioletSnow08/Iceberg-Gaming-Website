const express = require('express')
const app = express()
const port = 3000
let router = express.Router();
const {base_url, logger} = require("@/utils")


app.get(`/api/v1/user/:id`, function (req, res) {
  if(firebase.auth().currentUser) {
    con.query(`SELECT * FROM users WHERE id = ?`, [req.params.id], function (error, results, fields) {
      if (error) {
        logger.log({
          level: "emergency",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          id: firebase.auth().currentUser.uid
        })
        console.log("500");
        return res.status(500)
      }
      console.log("results");
      console.log(results);
    })
  } else {
    console.log("403");
    res.status(404);
    return;
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
