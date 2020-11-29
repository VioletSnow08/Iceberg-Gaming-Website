const express = require('express')
const router = express.Router();
const port = 3000
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
const logger = require("../../utils").logger;
const {requiresAuth} = require("../middleware/auth");

router.use(requiresAuth);

// POST: /api/v1/settings/loa/submit
// Params: none
// Body: accessToken, end_date, reason
// Return: loa
router.post('/loa/submit', async (req, res) => {
  const {accessToken, endDate, reason} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');

  let loa = {
    startDate: new Date().toLocaleString('en-US', {timeZone: 'America/Chicago'}),
    endDate: new Date(endDate).toLocaleString('en-US', {timeZone: 'America/Chicago'}),
    reason,
    userID
  }
  await con.query(`INSERT INTO loas (startDate, endDate, reason, userID) VALUES (?, ?, ?, ?)`, [loa.startDate, loa.endDate, loa.reason, loa.userID]).then(result => {
    loa = {
      ...loa,
      id: result.insertId
    }
    res.json(loa);
    logger.log({
      level: "info",
      loa,
      userID,
      message: "LOA Created",
      isLoggedIn: true
    })
  }).catch(error => {
    if(error) {
      logger.log({
        level: "error",
        loa,
        userID,
        message: error.message,
        stack: error.stack,
        isLoggedIn: true
      })
      res.sendStatus(500);
    }
  })
})



module.exports = {
  router
};
