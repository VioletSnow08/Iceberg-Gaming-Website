const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../utils.js");
const {DateTime} = require("luxon");
const {requiresAuth} = require("../middleware/auth");

router.use(requiresAuth);

// POST: /api/v1/administrative/disciplinary-action
// Params: none
// Body: accessToken
// Return: <status_code>
router.post('/disciplinary-action', async (req, res) => {
  let {accessToken, offender, division, date, whereDidThisOccur, witnesses, explanation, infraction, whatPunishment} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/administrative/disciplinary-action"
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

module.exports = {
  router
};
