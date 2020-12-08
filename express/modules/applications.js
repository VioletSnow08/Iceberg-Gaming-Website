const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../utils.js");
const {requiresAuth} = require("../middleware/auth");

router.use(requiresAuth);

// POST: /api/v1/applications
// Params: none
// Body: accessToken
// Return: loa
router.post('/', async (req, res) => {
  let {accessToken} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/applications"
  if(!accessToken) return res.status(400).send("Bad Request! Please pass in an accessToken.");
  let applications = [];

  con.query(`SELECT * FROM iceberg_applications ORDER BY createdAt desc`).then(results => {
    utils.logger.log({
      level: "info",
      message: "Iceberg Applications Fetched",
      isLoggedIn: true,
      userID,
      api,
      accessToken
    })
    results.forEach(row => {
      row.divison = "Iceberg";
      applications.push(row);
    })
    return con.query(`SELECT * FROM 17th_applications ORDER BY createdAt desc`)
  }).then(results => {
    utils.logger.log({
      level: "info",
      message: "17th Applications Fetched",
      isLoggedIn: true,
      userID,
      api,
      accessToken
    })
    results.forEach(row => {
      row.division = "17th";
      applications.push(row);
    })
    res.json(applications);
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
})

// POST: /api/v1/applications/create/<division>
// Params: division
// Body: accessToken, questions, userID
// Return: application
router.post('/create/:division', async (req, res) => {
  let {accessToken, division} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/applications/create"
  if(!accessToken || !division) return res.status(400).send("Bad Request! Please provide an accessToken and a division(17th, Iceberg, or CGS)");
  
})

module.exports = {
  router
};
