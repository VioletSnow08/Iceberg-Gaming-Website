const express = require('express')
const router = express.Router();
const port = 3000
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
const utils = require("../../utils.js");
const {requiresAuth} = require("../middleware/auth");
const {DateTime} = require("luxon");

router.use(requiresAuth);

// POST: /api/v1/settings/loa/submit
// Params: none
// Body: accessToken, end_date, reason
// Return: loa
router.post('/loa/submit', async (req, res) => {
  let {accessToken, endDate, reason} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  if (!accessToken || !endDate || !reason) return res.status(400).send("Bad Request! Please pass in an accessToken, endDate, and reason.")
  endDate = new Date(endDate);
  let loa = {
    startDate: DateTime.local().setZone('America/Chicago').toFormat('yyyy-MM-dd HH:mm:ss'),
    endDate: DateTime.fromObject({
      year: endDate.getFullYear(),
      month: endDate.getMonth(),
      day: endDate.getDay(),
      hour: endDate.getHours(),
      minutes: endDate.getMinutes(),
      seconds: endDate.getSeconds(),
      zone: 'America/Chicago'
    }).toFormat('yyyy-MM-dd HH:mm:ss'),
    reason,
    userID
  }
  await con.query(`INSERT INTO loas (startDate, endDate, reason, userID) VALUES (?, ?, ?, ?)`, [loa.startDate, loa.endDate, loa.reason, loa.userID]).then(result => {
    loa = {
      ...loa,
      id: result.insertId
    }
    res.json(loa);
    utils.logger.log({
      level: "info",
      loa,
      userID,
      message: "LOA Created",
      isLoggedIn: true
    })
  }).catch(error => {
    if (error) {
      utils.logger.log({
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

// POST: /api/v1/settings/loa/end
// Params: none
// Body: accessToken, userID, loaID
// Return: <status_code>
router.post('/loa/end', async (req, res) => {
  let {accessToken, userID, loaID} = req.body;
  const loggedInUserID = req.user.id;
  const con = req.app.get('con');
  if (!accessToken || !userID || !loaID) return res.status(400).send("Bad Request! Please pass in an accessToken, userID, and loaID.")
  let loa;

  if (userID === loggedInUserID) { // If the logged in user is the same as the user that is on LOA
    con.query(`UPDATE loas SET isDeleted = ? WHERE userID = ? AND id = ?`, [true, userID, loaID]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "User ended LOA",
        userID: loggedInUserID,
        loaID,
        isLoggedIn: true
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID,
          loaID,
          accessToken
        })
        res.sendStatus(500);
      }
    })
  } else if (req.user.roles) { // If the logged in user has roles
    if (utils.doesUserContainRoles(req.user.roles, ["[17th] NCO", "[17th] Alpha Company HQ", "[ICE] Owner", "[ICE] Admin"])) { // If the logged in user has permission to end an loa...
      con.query(`UPDATE loas SET isDeleted = ? WHERE userID = ? AND id = ?`, [true, userID, loaID]).then(() => {
        res.sendStatus(200);
        utils.logger.log({
          level: "info",
          message: "Admin ended LOA",
          userID: loggedInUserID,
          userOnLOAID: userID,
          loaID,
          isLoggedIn: true,
          roles: req.user.roles,
        })
      }).catch(error => {
        if (error) {
          utils.logger.log({
            level: "error",
            message: error.message,
            stack: error.stack,
            isLoggedIn: true,
            userID,
            loaID,
            accessToken
          })
          res.sendStatus(500);
        }
      })
    }
  } else res.sendStatus(401);
})


module.exports = {
  router
};
