const express = require('express')
const router = express.Router();
const port = 3000
const {base_url, logger} = require("../../utils")


router.get(`/api/v1/user/:id`, function (req, res) {
  let con = req.app.get('con');
  let firebase = req.app.get('firebase');
  // if(firebase.auth().currentUser) {
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
      console.log(results[0].discord);
    })
  // } else {
  //   console.log("403");
  //   res.status(404);
  //   return;
  // }
})

module.exports = router;
