const utils = require("../../../utils");
const axios = require("axios");
const {DateTime} = require("luxon");
module.exports.index = async function (req, res) {
  let {accessToken} = req.body;
  let {division} = req.params;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/applications/create"
  division = division.toLowerCase();
  let fullDivision;
  if (!accessToken || !division) return res.status(400).send("Bad Request! Please provide an accessToken and a division(17th, Iceberg, or CGS)");
  fullDivision = utils.applicationDivisionDisplay(division);
  let createdAt = DateTime.local().setZone('America/Chicago').toISO();
  if (division === "17th" && !utils.doesUserContainRoles(req.user.roles, ["[17th] Member"]) && !await checkForPreviousApplication(req, res, userID, con, division)) {
    await create17thApplication(req, res, userID, createdAt, con, division, fullDivision, api);
  } else if (division === "iceberg" && !utils.doesUserContainRoles(req.user.roles, ["[ICE] Member"]) && !await checkForPreviousApplication(req, res, userID, con, division)) {
    await createIcebergApplication(req, res, userID, createdAt, con, division, fullDivision, api);
  } else if (division === "cgs" && !utils.doesUserContainRoles(req.user.roles, ["[CGS] Member"]) && !await checkForPreviousApplication(req, res, userID, con, division)) {
    await createCGSApplication(req, res, userID, createdAt, con, division, fullDivision, api);
  } else {
    res.status(400).send("Bad Request! Invalid Division, already a member, or you have already submitted an application!");
  }
}


// Functions

async function postWebhook(req, fullDivision) {
  return axios.post(`https://discord.com/api/webhooks/794063253646606347/fW3OQJ-xw1h_YrCEr2sWiKE8te6UjdDqmmH8IZo0UWkCH3g8kkLpFh61UNZ1e2h1NBM8`, {
    embeds: [
      {
        title: 'New Application Submitted',
        description: 'The user, ' + req.user.username + ', has submitted a new application!',
        color: 60159,
        fields: [
          {
            name: 'Division',
            value: fullDivision
          }
        ]
      }
    ]
  })
}

async function checkForPreviousApplication(req, res, userID, con, division) {
  if (division === "17th") {
    return con.query(`SELECT * FROM 17th_applications WHERE userID = ? AND status = ?`, [userID, 'Waiting']).then(rows => {
      return !!(rows && rows[0]);
    })
  } else if (division === "iceberg") {
    return con.query(`SELECT * FROM iceberg_applications WHERE userID = ? AND status = ?`, [userID, 'Waiting']).then(rows => {
      return !!(rows && rows[0]);
    })
  } else if(division === "cgs") {
    return con.query(`SELECT * FROM cgs_applications WHERE userID = ? AND status = ?`, [userID, 'Waiting']).then(rows => {
      return !!(rows && rows[0]);
    })
  } else {
    return false;
  }
}

async function create17thApplication(req, res, userID, createdAt, con, division, fullDivision, api) {
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
  if ((ranger || medic || sapper || pilot || tank_crew || idf || attendOps) !== (true || false)) return res.status(400).send("Bad Request! Please provide ALL questions in the body.");
  con.query(`INSERT INTO 17th_applications (userID, createdAt, steamURL, timezone, age, arma3Hours, hobbies, whyJoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, createdAt, steamURL, timezone, age, arma3Hours, hobbies, whyJoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps]).then(row => {
    let rowID = row.insertId;
    return con.query(`INSERT INTO applications (userID, division, applicationID, createdAt) VALUES (?, ?, ?, ?)`, [userID, "17th", rowID, createdAt])
  }).then(() => {
    return postWebhook(req, fullDivision);
  }).then(() => {
    res.sendStatus(200);
    utils.logger.log({
      level: "info",
      message: "Application Created",
      isLoggedIn: true,
      userID,
      api,
      division
    })
  }).catch(error => {
    if (error) {
      utils.logger.log({
        level: "error",
        message: error.message,
        stack: error.stack,
        isLoggedIn: true,
        userID,
        api,
        division
      })
      res.sendStatus(500);
    }
  })
}


async function createIcebergApplication(req, res, userID, createdAt, con, division, fullDivision, api) {
  let {
    steamURL,
    age,
    hobbies,
    gamesTheyJoinFor,
    hoursInGamesTheyJoinFor,
    areYouInAnyCommunities,
    whyJoin,
    whereDidYouHearUsFrom
  } = req.body;
  con.query(`INSERT INTO iceberg_applications (userID, createdAt, steamURL, age, hobbies, gamesTheyJoinFor, hoursInGamesTheyJoinFor, areYouInAnyCommunities, whyJoin, whereDidYouHearUsFrom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, createdAt, steamURL, age, hobbies, gamesTheyJoinFor, hoursInGamesTheyJoinFor, areYouInAnyCommunities, whyJoin, whereDidYouHearUsFrom]).then(row => {
    let rowID = row.insertId;
    return con.query(`INSERT INTO applications (userID, division, applicationID, createdAt) VALUES (?, ?, ?, ?)`, [userID, "Iceberg", rowID, createdAt])
  }).then(() => {
    return postWebhook(req, fullDivision);
  }).then(() => {
    res.sendStatus(200);
    utils.logger.log({
      level: "info",
      message: "Application Created",
      isLoggedIn: true,
      userID,
      api,
      division
    })
  }).catch(error => {
    if (error) {
      utils.logger.log({
        level: "error",
        message: error.message,
        stack: error.stack,
        isLoggedIn: true,
        userID,
        api,
        division
      })
      res.sendStatus(500);
    }
  })
}

async function createCGSApplication(req, res, userID, createdAt, con, division, fullDivision, api) {
  let {
    steamURL,
    age,
    playstyle,
    whyJoin,
    squadron,
    whereDidYouHearAboutUs
  } = req.body;
  if ((steamURL || age || whyJoin || playstyle || squadron || whereDidYouHearAboutUs) === undefined) return res.status(400).send("Bad Request! Please provide ALL questions in the body.");
  con.query(`INSERT INTO cgs_applications (userID, steamURL, age, whyJoin, playstyle, squadron, whereDidYouHearAboutUs, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [userID, steamURL, age, whyJoin, playstyle, squadron, whereDidYouHearAboutUs, createdAt]).then(row => {
    let rowID = row.insertId;
    return con.query(`INSERT INTO applications (userID, division, applicationID, createdAt) VALUES (?, ?, ?, ?)`, [userID, "CGS", rowID, createdAt])
  }).then(() => {
    return postWebhook(req, fullDivision);
  }).then(() => {
    res.sendStatus(200);
    utils.logger.log({
      level: "info",
      message: "Application Created",
      isLoggedIn: true,
      userID,
      api,
      division
    })

  }).catch(error => {
    if (error) {
      utils.logger.log({
        level: "error",
        message: error.message,
        stack: error.stack,
        isLoggedIn: true,
        userID,
        api,
        division
      })
      res.sendStatus(500);
    }
  })
}
