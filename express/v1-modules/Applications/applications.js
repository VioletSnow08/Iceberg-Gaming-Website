const axios = require("axios");
const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../../utils.js");
const {DateTime} = require("luxon");
const {requiresAuth} = require("../../middleware/auth");

router.use(requiresAuth);

// POST: /api/v1/applications
// Params: none
// Body: accessToken
// Return: loa
router.post('/', async (req, res) => {
  require("./index").index(req, res);
})

// POST: /api/v1/applications/create/<division>
// Params: division
// Body: accessToken, questions
// Return: application
router.post('/create/:division', async (req, res) => {
  require("./create").index(req, res);
})

// POST: /api/v1/applications/<action>/<id>
// Params: action, id, division
// Body: accessToken
// Return: application

router.delete('/change/', async (req, res) => {
  let {accessToken} = req.body;
  let {action, id, division} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/applications/" + action;
  let comment;
  let status;
  let applicantID;
  let subApplicationID;
  division = division.toLowerCase();
  action = action.toLowerCase();
  if (!accessToken || !action || !id || !division) return res.status(400).send("Bad Request! Please provide an accessToken, action, division, and id");
  if (action !== "approve" && action !== "deny" && action !== "process") return res.status(400).send("Bad Request! Please provide a valid action!");
  if (!utils.doesUserContainRoles(req.user.roles, ["[ICE] Recruiter", "[ICE] Admin", "[ICE] Owner", '[ICE] Webmaster'])) return res.status(401).send("Unauthorized!");
  con.query(`SELECT * FROM applications WHERE id = ?`, [id]).then(rows => {
    if (rows) {
      applicantID = rows[0].userID;
      subApplicationID = rows[0].applicationID;
      utils.logger.log({
        level: "info",
        message: "Application Fetched",
        api,
        userID,
        applicantID,
        accessToken,
        division,
        action,
        isLoggedIn: true
      })

      if (division === "17th" && action === "approve") {
        comment = bctMessageApprove(req);
        status = "Approved";
        con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [applicantID, '[ICE] Applicant']).then(() => {
          utils.logger.log({
            level: "info",
            message: "Deleted Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [applicantID, '[ICE] Member'])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Created Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [applicantID, '[17th] Member'])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Created Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`UPDATE 17th_applications SET comment = ?, status = ? WHERE userID = ? AND id = ?`, [comment, status, applicantID, subApplicationID])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if (error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              api,
              userID,
              accessToken,
              division,
              applicantID,
              subApplicationID,
              action,
              isLoggedIn: true
            })
          }
        })
      } else if (division === "17th" && action === "process") {
        comment = bctMessageProcess(req);
        status = "Processed";
        con.query(`UPDATE 17th_applications SET comment = ?, status = ? WHERE userID = ? AND id = ?`, [comment, status, applicantID, subApplicationID]).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if (error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              subApplicationID,
              division,
              id,
              action,
              api
            })
          }
        })
      } else if (division === "17th" && action === "deny") {
        comment = bctMessageDeny(req);
        status = "Denied";
        con.query(`UPDATE 17th_applications SET comment = ?, status = ? WHERE userID = ? AND id = ?`, [comment, status, applicantID, subApplicationID]).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if (error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              subApplicationID,
              division,
              id,
              action,
              api
            })
          }
        })
      } else if(division === "iceberg" && action === "approve") {
        comment = icebergMessageApprove(req);
        status = "Approved";
        con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [applicantID, '[ICE] Applicant']).then(() => {
          utils.logger.log({
            level: "info",
            message: "Deleted Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [applicantID, '[ICE] Member'])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Created Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`UPDATE iceberg_applications SET status = ?, comment = ? WHERE id = ? AND userID = ?`, [status, comment, subApplicationID, applicantID])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200)
        }).catch(error => {
          if(error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              division,
              id,
              subApplicationID,
              api
            })
          }
        })
      } else if(division === "iceberg" && action === "process") {
        comment = icebergMessageProcess(req);
        status = "Processed";
        con.query(`UPDATE iceberg_applications SET status = ?, comment = ? WHERE id = ? AND userID = ?`, [status, comment, subApplicationID, applicantID]).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if(error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              division,
              id,
              subApplicationID,
              api
            })
          }
        })
      } else if(division === "iceberg" && action === "deny") {
        comment = icebergMessageDeny(req);
        status = "Denied";
        con.query(`UPDATE iceberg_applications SET status = ?, comment = ? WHERE id = ? AND userID = ?`, [status, comment, subApplicationID, applicantID]).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if(error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              division,
              id,
              subApplicationID,
              api
            })
          }
        })
      } else res.sendStatus(400);
    } else {
      res.sendStatus(400);
    }
  }).catch(e => {
    if (e) {
      if (!res.headersSent) {
        res.sendStatus(500);
      }
      utils.logger.log({
        level: "error",
        message: e.message,
        stack: e.stack,
        api,
        userID,
        accessToken,
        division,
        action,
        isLoggedIn: true
      })
    }
  })
})

module.exports = {
  router
};


function bctMessageApprove(req) {
  return "Hello,\n" +
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
    "Finally, please take the time to familiarize yourself with our Code of Conduct, Ranks, and Structure misc. You might also take the time to browse our forums and introduce yourself.\n" +
    "\n" +
    "If you have any further questions or issues, you are more than welcome to ask anyone on Teamspeak, Discord, or even Enjin and we will help out as best as we can!\n" +
    "\n" +
    "Regards,\n" +
    "\n" +
    `${req.user.username}`
}

function bctMessageDeny(req) {
  return "Hello,\n" +
    "We have reviewed your application and we thank you for your interest in joining the 17th Brigade Combat Team. However, we are regrettably unable to accept your application at this time. Please feel free to inquire why your application was not approved. You are free to resubmit your application in the future when we may be better able to incorporate you.\n" +
    "\n" +
    "All the best.\n" +
    "\n" +
    "-Staff\n";
}

function bctMessageProcess(req) {
  return "Hello,\n" +
    "\n" +
    `Your application has been processed and the recruiter has requested an interview. When you're able to, hop on to the TeamSpeak (${utils.data.teamspeak}) and reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here.\n` +
    "\n" +
    "Thanks,\n" +
    "\n" +
    `${req.user.username}`
}

function icebergMessageApprove(req) {
  return "Welcome to Iceberg Gaming! We're glad to have you aboard our community and hope you can feel at home in our community. \n" +
    "\n" +
    `If you haven't already, we highly recommend you join our Teamspeak (${utils.data.teamspeak}) and Discord (${utils.data.discord}) so you can play with the rest of the community. Feel free to chat in any of the channels with all the members of the community, and don't be afraid to explore some of the other games that we play in Iceberg Gaming. Keep yourself updated on the Guilded Calendar for any Iceberg events and don't be afraid to gather some people and schedule something of your own.\n` +
    "\n" +
    "Lastly, be sure to read up on the Community Code of Conduct so you make sure you can continue to have a good time in the community.\n" +
    "If you have any further questions or issues, you are more than welcome to ask anyone on Teamspeak, Discord, or even Guilded and we will help out as best as we can!\n" +
    "Regards, \n" + req.user.username;
}

function icebergMessageProcess(req) {
  return "Hello,\n" +
    "\n" +
    `Your application has been processed and the recruiter has requested an interview. When you're able to, hop on to the TeamSpeak (${utils.data.teamspeak}) and reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here.\n` +
    "\n" +
    "Thanks,\n" +
    "\n" +
    `${req.user.username}`;
}

function icebergMessageDeny(req) {
  return "We have reviewed your application and we thank you for your interest in joining Iceberg Gaming. However, we are regrettably unable to accept your application at this time. Please feel free to inquire why your application was not approved. You are free to resubmit your application in the future when we may be better able to incorporate you.\n" +
    "All the best.\n" +
    "-Staff";
}

