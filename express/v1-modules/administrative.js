const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../utils.js");
const {DateTime} = require("luxon");
const {requiresAuth} = require("../middleware/auth");
const REQUIRED_ROLES = ["[17th] Alpha Company HQ", "[ICE] Owner", "[ICE] Webmaster"];
router.use(requiresAuth);
// POST: /api/v1/administrative/disciplinary-action
// Params: none
// Body: accessToken
// Return: <status_code>
router.post('/disciplinary-action', async (req, res) => {
  let {accessToken} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/administrative/disciplinary-action"
  if (!accessToken) return res.status(400).send("Bad Request! Please pass in an accessToken!");
  if(utils.doesUserContainRoles(req.user.roles, REQUIRED_ROLES)) {
    con.query(`SELECT * FROM disciplinary_action_forms`).then(rows => {
      res.json(rows);
      utils.logger.log({
        level: "info",
        isLoggedIn: true,
        message: "Disciplinary Action Forms Fetched",
        userID,
        accessToken,
        api
      })
    }).catch(error => {
      if(error) {
        res.sendStatus(500);
        utils.logger.log({
          level: "error",
          isLoggedIn: true,
          message: error.message,
          stack: error.stack,
          userID,
          accessToken,
          api
        })
      }
    })
  } else {
    res.sendStatus(401);
    utils.logger.log({
      level: "notice",
      isLoggedIn: true,
      userID,
      accessToken,
      message: "User attempted accessing Disciplinary Action Forms",
      api
    })
  }
})

// POST: /api/v1/administrative/disciplinary-action/submit
// Params: none
// Body: accessToken, answers
// Return: <status_code>
router.post('/disciplinary-action/submit', async (req, res) => {
  let {accessToken, offender, division, date, whereDidThisOccur, witnesses, explanation, infraction, whatPunishment} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/administrative/disciplinary-action/submit"
  if (!accessToken || !offender || !division || !date || !whereDidThisOccur ||!witnesses || !explanation || !infraction || !whatPunishment) return res.status(400).send("Bad Request! Please pass in ALL fields in the body.");
  let createdAt = DateTime.local().setZone('America/Chicago').toFormat('yyyy-MM-dd HH:mm:ss');
  con.query(`INSERT INTO disciplinary_action_forms (userID, offender, division, date, whereDidThisOccur, witnesses, explanation, infraction, whatPunishment, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, offender, division, date, whereDidThisOccur, witnesses, explanation, infraction, whatPunishment, createdAt]).then(() => {
    res.sendStatus(200);
    utils.logger.log({
      level: "info",
      message: "Disciplinary Action Form Submitted",
      userID,
      offender,
      explanation,
      isLoggedIn: true,
      accessToken,
      api
    })
  }).catch(error => {
    if(error) {
      res.sendStatus(500)
      utils.logger.log({
        level: "emergency",
        message: error.message,
        stack: error.stack,
        isLoggedIn: true,
        userID,
        offender,
        explanation,
        accessToken,
        api
      })
    }
  })
})

// POST: /api/v1/administrative/disciplinary-action/submit
// Params: none
// Body: accessToken, answers
// Return: <status_code>
router.post('/disciplinary-action/review', async (req, res) => {
  let {accessToken, comment, punishment, id} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/administrative/disciplinary-action/view"
  if (!accessToken || !comment || !id ) return res.status(400).send("Bad Request! Please pass in ALL fields in the body.");
  if(utils.doesUserContainRoles(req.user.roles, REQUIRED_ROLES)) {
    con.query(`UPDATE disciplinary_action_forms SET comment = ?, actualPunishment = ?, whoPunished = ? WHERE id = ?`, [comment, punishment, userID, id]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "Updated Disciplinary Action Form",
        isLoggedIn: true,
        userID,
        api,
        accessToken
      })
    }).catch(error => {
      if(error) {
        res.sendStatus(500);
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID,
          api,
          accessToken
        })
      }
    })
  } else res.sendStatus(401);
})

module.exports = {
  router
};
