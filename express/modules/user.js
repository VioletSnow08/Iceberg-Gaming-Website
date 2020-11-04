const express = require('express')
const router = express.Router();
const port = 3000
const {base_url, logger} = require("../../utils")
const base_api = "/api/v1";
// GET: User
// Params: id
router.get(`${base_api}/user/:id`, function (req, res) {
  let con = req.app.get('con');
  let firebase = req.app.get('firebase');
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
        return res.status(500).send("An error occurred querying the database.");
      }
      return res.send(results);
    })
  } else {
    return res.status(403).send("User is not signed in");
  }
})

// POST: Login in User
// Params: None
// Body: email, password

router.post(`${base_api}/user`, async function(req, res) {
  let con = req.app.get('con');
  let firebase = req.app.get('firebase');
  if(!req.body.email || !req.body.password) {
    return res.status(400).send("Please provide an email and password!");
  }
  await firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then(async () => {
    logger.info({
      message: "User logged in",
      userID: firebase.auth().currentUser.uid,
      isLoggedIn: true
    })
    res.sendStatus(200);
  }).catch(error => {
    if (error) {
      logger.log({
        level: "emergency",
        message: error.message,
        email: req.body.email, // Only way to identify the user
        stack: error.stack,
        isLoggedIn: false
      })
      return res.status(500).send(error.message);
    }
  })
})

module.exports = router;
