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
  require("./Disciplinary Action/review").index(req, res, REQUIRED_ROLES);
})

module.exports = {
  router
};
