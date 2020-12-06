const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../utils.js");
const {requiresAuth} = require("../middleware/auth");

router.use(requiresAuth);

// POST: /api/v1/settings/applications
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
    results.forEach(row => {
      applications.push(row);
    })
    return con.query(`SELECT * FROM 17th_applications ORDER BY createdAt desc`)
  }).then(results => {
    results.forEach(row => {
      applications.push(row);
    })
    res.json(applications);
  }).catch(error => {
    if(error) {
      res.sendStatus(500);
      console.log(error);
    }
  })
})

module.exports = {
  router
};
