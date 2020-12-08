const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../utils.js");
const {DateTime} = require("luxon");
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
  if (!accessToken) return res.status(400).send("Bad Request! Please pass in an accessToken.");
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
    if (error) {
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
  let {accessToken} = req.body;
  let {division} = req.params;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/applications/create"
  if (!accessToken || !division || (division && division !== ("17th" || "Iceberg" || "CGS"))) return res.status(400).send("Bad Request! Please provide an accessToken and a division(17th, Iceberg, or CGS)");
  if (division === "17th" && !utils.doesUserContainRolesAuth(req.user.roles, "[17th] Member")) {
    let {
      steamURL,
      timezone,
      age,
      arma3Hours,
      hobbies,
      whyJoin,
      attractmilsim,
      ranger,
      medic,
      sapper,
      pilot,
      tank_crew,
      idf,
      attendOps
    } = req.body;
    if ((steamURL || timezone || age || arma3Hours || hobbies || whyJoin || attractmilsim || ranger || medic || sapper || pilot || tank_crew || idf || attendOps) === undefined) return res.status(400).send("Bad Request! Please provide ALL questions in the body.");
    if((ranger || medic || sapper || pilot || tank_crew || idf || attendOps) !== (true || false)) return res.status(400).send("Bad Request! Please provide ALL questions in the body.");
    let createdAt = DateTime.local().setZone('America/Chicago').toFormat('yyyy-MM-dd HH:mm:ss');
    con.query(`INSERT INTO 17th_applications (userID, createdAt, steamURL, timezone, age, arma3Hours, hobbies, whyJoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, createdAt, steamURL, timezone, age, arma3Hours, hobbies, whyJoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps, "Waiting"]).then(row => {
      let rowID = row.insertId;
      let safeApplication = {
        steamURL,
        timezone,
        age,
        arma3Hours,
        hobbies,
        whyJoin,
        attractmilsim,
        ranger,
        medic,
        sapper,
        pilot,
        tank_crew,
        idf,
        attendOps,
        createdAt,
        id: rowID,
        status: "Waiting"
      }
      res.json(safeApplication);
    }).catch(error => {
      if(error) {
        console.log(error);
        res.sendStatus(500);
      }
    })
  }
})

module.exports = {
  router
};
