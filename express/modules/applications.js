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
  division = division.toLowerCase();
  console.log(division)
  if (!accessToken || !division) return res.status(400).send("Bad Request! Please provide an accessToken and a division(17th, Iceberg, or CGS)");
  if (division === "17th" && !utils.doesUserContainRoles(req.user.roles, "[17th] Member")) {
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
    let createdAt = DateTime.local().setZone('America/Chicago').toFormat('yyyy-MM-dd HH:mm:ss');
    con.query(`INSERT INTO 17th_applications (userID, createdAt, steamURL, timezone, age, arma3Hours, hobbies, whyJoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, createdAt, steamURL, timezone, age, arma3Hours, hobbies, whyJoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps]).then(row => {
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
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
    })
  } else if (division === "iceberg" && !utils.doesUserContainRoles(req.user.roles, "[ICE] Member")) {
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
    let createdAt = DateTime.local().setZone('America/Chicago').toFormat('yyyy-MM-dd HH:mm:ss');
    con.query(`INSERT INTO iceberg_applications (userID, createdAt, steamURL, age, hobbies, gamesTheyJoinFor, hoursInGamesTheyJoinFor, areYouInAnyCommunities, whyJoin, whereDidYouHearUsFrom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, createdAt, steamURL, age, hobbies, gamesTheyJoinFor, hoursInGamesTheyJoinFor, areYouInAnyCommunities, whyJoin, whereDidYouHearUsFrom]).then(row => {
      let rowID = row.insertId;
      let safeApplication = {
        steamURL,
        userID,
        id: rowID,
        createdAt,
        age,
        hobbies,
        gamesTheyJoinFor,
        hoursInGamesTheyJoinFor,
        areYouInAnyCommunities,
        whyJoin,
        whereDidYouHearUsFrom,
        status: "Waiting"
      }
      res.json(safeApplication)
    }).catch(error => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
      }
    })
  } else {
    res.status(400).send("Bad Request! Invalid Division or in-proper roles.");
  }
})

// POST: /api/v1/applications/<action>/<id>
// Params: action, id, division
// Body: accessToken
// Return: application

router.delete('/change/', async (req, res) => {
  let {accessToken} = req.body;
  console.log(req.user.roles);
  let {action, id, division} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/applications/" + action;
  let comment;
  let status;
  if (!accessToken || !action || !id || !division) return res.status(400).send("Bad Request! Please provide an accessToken, action, division, and id");
  if(action.toLowerCase() !== "approve" && action.toLowerCase() !== "deny" && action.toLowerCase() !== "process") return res.status(400).send("Bad Request! Please provide a valid action!");
  if (utils.doesUserContainRoles(req.user.roles, ["[ICE] Recruiter", "[ICE] Admin", "[ICE] Owner"])) {
    if (division.toLowerCase() === "17th") {
      if (action.toLowerCase() === "approve") {
        comment = "Hello,\n" +
          "\n" +
          "Your application to the 17th Brigade Combat Team has been accepted! It is our great pleasure to welcome you to the community. \n" +
          "\n" +
          "There are only a couple of things to take care of in order to join us on the battlefield: \n" +
          "\n" +
          "First, you need to obtain the modpack that we use on our private server. It can take a little while to download everything, so try to get it started as soon as possible. The following link will take you to our \"shadow mod\" which acts as a dependency node for all of the mods we use. In order to get the mod pack, simply subscribe to the Shadow Mod, and when it asks if you want to download all mods associated, say yes.\n" +
          "\n" +
          `${utils.data.bct_modpack}\n` +
          "\n" +
          "Second, once you have your modpack, look for anybody that is Corporal or above on TeamSpeak or make a post on the Discord and someone will get you set up. \n" +
          "\n" +
          `TS: ${utils.data.teamspeak}\n` +
          `Discord: ${utils.data.discord}\n` +
          "\n" +
          "They will be able to help you or find someone to help you with initial assessments and/or training. Basic Training is held weekly on Tuesdays, but don't let that stop you from jumping in during the week and Saturday op to play with us!\n" +
          "\n" +
          "Finally, please take the time to familiarize yourself with our Code of Conduct, Ranks, and Structure pages. You might also take the time to browse our forums and introduce yourself.\n" +
          "\n" +
          "If you have any further questions or issues, you are more than welcome to ask anyone on Teamspeak, Discord, or even Enjin and we will help out as best as we can!\n" +
          "\n" +
          "Regards,\n" +
          "\n" +
          `${req.user.username}`
        status = "Approved";
      } else if (action.toLowerCase() === "deny") {
        comment = "Hello,\n" +
          "We have reviewed your application and we thank you for your interest in joining the 17th Brigade Combat Team. However, we are regrettably unable to accept your application at this time. Please feel free to inquire why your application was not approved. You are free to resubmit your application in the future when we may be better able to incorporate you.\n" +
          "\n" +
          "All the best.\n" +
          "\n" +
          "-Staff\n";
        status = "Denied";
      } else if (action.toLowerCase() === "process") {
        comment = "Hello,\n" +
          "\n" +
          `Your application has been processed and the recruiter has requested an interview. When you're able to, hop on to the TeamSpeak (${utils.data.teamspeak}) and reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here.\n` +
          "\n" +
          "Thanks,\n" +
          "\n" +
          `${req.user.username}`
        status = "Processed";
      }
      if(status && comment) {
        con.query(`UPDATE 17th_applications SET comment = ?, status = ? WHERE id = ?`, [comment, status, id]).then(() => {
          res.sendStatus(200);
          utils.logger.log({
            level: "info",
            message: "Application Status Changed",
            status,
            comment,
            userID,
            id,
            division,
            api,
            action
          })
        }).catch(error => {
          if(error) {
            res.sendStatus(500)
            utils.logger.log({
              level: "error",
              message: error.message,
              error: error.stack,
              status,
              comment,
              userID,
              id,
              division,
              api,
              action
            })
          }
        })
      }
    } else if(division.toLowerCase() === "iceberg") {
      if(action.toLowerCase() === "approve") {
        comment = "Welcome to Iceberg Gaming! We're glad to have you aboard our community and hope you can feel at home in our community. \n" +
          "\n" +
          `If you haven't already, we highly recommend you join our Teamspeak (${utils.data.teamspeak}) and Discord (${utils.data.discord}) so you can play with the rest of the community. Feel free to chat in any of the channels with all the members of the community, and don't be afraid to explore some of the other games that we play in Iceberg Gaming. Keep yourself updated on the Guilded Calendar for any Iceberg events and don't be afraid to gather some people and schedule something of your own.\n` +
          "\n" +
          "Lastly, be sure to read up on the Community Code of Conduct so you make sure you can continue to have a good time in the community.\n" +
          "If you have any further questions or issues, you are more than welcome to ask anyone on Teamspeak, Discord, or even Guilded and we will help out as best as we can!\n" +
          "Regards, \n" + req.user.username;
        status = "Approved";
      } else if(action.toLowerCase() === "process") {
        comment = "Hello,\n" +
          "\n" +
          `Your application has been processed and the recruiter has requested an interview. When you're able to, hop on to the TeamSpeak (${utils.data.teamspeak}) and reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here.\n` +
          "\n" +
          "Thanks,\n" +
          "\n" +
          `${req.user.username}`
        status = "Processed";
      } else if(action.toLowerCase() === "deny") {
        comment = "We have reviewed your application and we thank you for your interest in joining Iceberg Gaming. However, we are regrettably unable to accept your application at this time. Please feel free to inquire why your application was not approved. You are free to resubmit your application in the future when we may be better able to incorporate you.\n" +
          "All the best.\n" +
          "-Staff";
        status = "Denied";
      }
    } else if(division.toLowerCase() === "cgs") {

    } else res.status(400).send("Bad Request! Please provide a valid division!");
  } else res.status(401).send("Unauthorized!");
})

module.exports = {
  router
};
