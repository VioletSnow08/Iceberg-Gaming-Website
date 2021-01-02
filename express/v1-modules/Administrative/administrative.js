const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../../utils.js");
const {DateTime} = require("luxon");
const {requiresAuth} = require("../../middleware/auth");
const REQUIRED_ROLES = ["[17th] Alpha Company HQ", "[ICE] Owner", "[ICE] Webmaster"];
router.use(requiresAuth);
// POST: /api/v1/administrative/disciplinary-action
// Params: none
// Body: accessToken
// Return: <status_code>
router.post('/disciplinary-action', async (req, res) => {
  require("./Disciplinary Action/index").index(res, res, REQUIRED_ROLES);
})

// POST: /api/v1/administrative/disciplinary-action/submit
// Params: none
// Body: accessToken, answers
// Return: <status_code>
router.post('/disciplinary-action/submit', async (req, res) => {
  require("./Disciplinary Action/submit").index(req, res)
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
