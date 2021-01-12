const express = require('express')
const router = express.Router();
const port = 3000
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
const utils = require("../../utils.js");
const {requiresAuth} = require("../middleware/auth");
const {DateTime} = require("luxon");

router.use(requiresAuth);

// POST: /api/v1/settings/loa/submit
// Params: none
// Body: accessToken, end_date, reason
// Return: loa
router.post('/loa/submit', async (req, res) => {
  let {accessToken, endDate, reason} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/loa/submit"
  if (!accessToken || !endDate || !reason) return res.status(400).send("Bad Request! Please pass in an accessToken, endDate, and reason.")
  let loa = {
    startDate: DateTime.local().setZone('America/Chicago').toISO(),
    endDate: DateTime.fromISO(endDate).setZone('America/Chicago').toISO(),
    reason,
    userID
  }
  await con.query(`INSERT INTO loas (startDate, endDate, reason, userID) VALUES (?, ?, ?, ?)`, [loa.startDate, loa.endDate, loa.reason, loa.userID]).then(result => {
    loa = {
      ...loa,
      id: result.insertId
    }
    res.json(loa);
    utils.logger.log({
      level: "info",
      loa,
      userID,
      message: "LOA Created",
      isLoggedIn: true,
      api
    })
  }).catch(error => {
    if (error) {
      utils.logger.log({
        level: "error",
        loa,
        userID,
        message: error.message,
        stack: error.stack,
        isLoggedIn: true,
        api
      })
      res.sendStatus(500);
    }
  })
})

// POST: /api/v1/settings/loas
// Params: none
// Body: accessToken
// Return: <status_code>
router.post('/loas', async (req, res) => {
  let {accessToken} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/loas"
  con.query(`SELECT * FROM loas`).then(results => {
    utils.logger.log({
      level: "info",
      message: "LOAs Fetched",
      userID,
      api,
      isLoggedIn: true
    })
    res.json(results);
  }).catch(error => {
    if(error) {
      res.sendStatus(500);
    }
  })
})



// POST: /api/v1/settings/loa/end
// Params: none
// Body: accessToken, userID, loaID
// Return: <status_code>
router.post('/loa/end', async (req, res) => {
  let {accessToken, userID, loaID} = req.body;
  const loggedInUserID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/loa/end"
  if (!accessToken || !userID || !loaID) return res.status(400).send("Bad Request! Please pass in an accessToken, userID, and loaID.")

  if (userID === loggedInUserID) { // If the logged in user is the same as the user that is on LOA
    con.query(`UPDATE loas SET isDeleted = ? WHERE userID = ? AND id = ?`, [true, userID, loaID]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "User ended LOA",
        userID: loggedInUserID,
        loaID,
        isLoggedIn: true,
        api
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID,
          loaID,
          api,
          accessToken,
        })
        res.sendStatus(500);
      }
    })
  } else if (req.user.roles) { // If the logged in user has roles
    if (utils.doesUserContainRoles(req.user.roles, ["[17th] NCO", "[17th] Alpha Company HQ", "[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"])) { // If the logged in user has permission to end an loa...
      con.query(`UPDATE loas SET isDeleted = ? WHERE userID = ? AND id = ?`, [true, userID, loaID]).then(() => {
        res.sendStatus(200);
        utils.logger.log({
          level: "info",
          message: "Admin ended LOA",
          userID: loggedInUserID,
          victim: userID,
          loaID,
          isLoggedIn: true,
          roles: req.user.roles,
          api
        })
      }).catch(error => {
        if (error) {
          utils.logger.log({
            level: "error",
            message: error.message,
            stack: error.stack,
            isLoggedIn: true,
            userID: loggedInUserID,
            victim: userID,
            loaID,
            api,
            accessToken
          })
          res.sendStatus(500);
        }
      })
    }
  } else res.sendStatus(401);
})

// POST: /api/v1/settings/status
// Params: none
// Body: accessToken, userID, status
// Return: <status_code>
router.post('/status', async (req, res) => {
  let {accessToken, userID, status} = req.body;
  const loggedInUserID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/status";
  if (!accessToken || !userID || !status) return res.status(400).send("Bad Request! Please pass in an accessToken, userID, and status.")

  if(userID === loggedInUserID) {
    con.query(`UPDATE users SET status = ? WHERE id = ?`, [status, loggedInUserID]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "User changed status",
        userID: loggedInUserID,
        status,
        isLoggedIn: true,
        api
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: loggedInUserID,
          status,
          api,
          accessToken
        })
        res.sendStatus(500);
      }
    })
  } else if(utils.doesUserContainRoles(req.user.roles, ["[17th] NCO", "[17th] Alpha Company HQ", "[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"])) {
    con.query(`UPDATE users SET status = ? WHERE id = ?`, [status, userID]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "Admin changed Status",
        userID: loggedInUserID,
        victim: userID,
        status,
        isLoggedIn: true,
        api
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: loggedInUserID,
          victim: userID,
          status,
          api,
          accessToken
        })
        res.sendStatus(500);
      }
    })
  } else res.sendStatus(401);
})

// POST: /api/v1/settings/discord
// Params: none
// Body: accessToken, userID, discord
// Return: <status_code>
router.post('/discord', async (req, res) => {
  let {accessToken, userID, discord} = req.body;
  const loggedInUserID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/discord";
  if (!accessToken || !userID || !discord) return res.status(400).send("Bad Request! Please pass in an accessToken, userID, and discord.")

  if(userID === loggedInUserID) {
    con.query(`UPDATE users SET discord = ? WHERE id = ?`, [discord, loggedInUserID]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "User changed Discord Username & Tag",
        userID: loggedInUserID,
        discord,
        isLoggedIn: true,
        api
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: loggedInUserID,
          discord,
          api,
          accessToken
        })
        res.sendStatus(500);
      }
    })
  } else if(utils.doesUserContainRoles(req.user.roles, ["[17th] NCO", "[17th] Alpha Company HQ", "[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"])) {
    con.query(`UPDATE users SET discord = ? WHERE id = ?`, [discord, userID]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "Admin changed Discord Username & Tag",
        userID: loggedInUserID,
        victim: userID,
        discord,
        isLoggedIn: true,
        api
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: loggedInUserID,
          victim: userID,
          discord,
          api,
          accessToken
        })
        res.sendStatus(500);
      }
    })
  } else res.sendStatus(401);
})

// POST: /api/v1/settings/username
// Params: none
// Body: accessToken, userID, username
// Return: <status_code>
router.post('/username', async (req, res) => {
  let {accessToken, userID, username} = req.body;
  const loggedInUserID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/username";
  if (!accessToken || !userID || !username) return res.status(400).send("Bad Request! Please pass in an accessToken, userID, and a username.")

  if(userID === loggedInUserID) {
    con.query(`UPDATE users SET username = ? WHERE id = ?`, [username, loggedInUserID]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "User changed Username",
        userID: loggedInUserID,
        username,
        isLoggedIn: true,
        api
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: loggedInUserID,
          username,
          api,
          accessToken
        })
        res.sendStatus(500);
      }
    })
  } else if(utils.doesUserContainRoles(req.user.roles, ["[17th] NCO", "[17th] Alpha Company HQ", "[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"])) {
    con.query(`UPDATE users SET username = ? WHERE id = ?`, [username, userID]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "Admin changed Username",
        userID: loggedInUserID,
        victim: userID,
        username,
        isLoggedIn: true,
        api
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: loggedInUserID,
          victim: userID,
          username,
          api,
          accessToken
        })
        res.sendStatus(500);
      }
    })
  } else res.sendStatus(401);
})

// POST: /api/v1/settings/delete_account
// Params: none
// Body: accessToken, userID
// Return: <status_code>
router.post('/delete_account', async (req, res) => {
  let {accessToken, userID} = req.body;
  const loggedInUserID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/delete_account";
  if (!accessToken || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken, userID.")

  if(userID !== loggedInUserID) return res.sendStatus(400);

  con.query(`DELETE FROM 17th_applications WHERE userID = ?`, [userID]).then(() => {
    return con.query(`DELETE FROM cgs_applications WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM iceberg_applications WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM channels_documents_pdfs WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM channels_forums_replies WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM channels_forums_topics WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM channels_calendar_attendance WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM channels_calendar_events WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM disciplinary_action_forms WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM loas WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM iceberg_applications WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM user_roles WHERE userID = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM tokens WHERE id = ?`, [userID])
  }).then(() => {
    return con.query(`DELETE FROM users WHERE id = ?`, [userID])
  }).then(() => {
    res.sendStatus(200);
    utils.logger.log({
      level: "info",
      message: "User Deleted Account",
      userID,
      api,
      isLoggedIn: true
    })
  }).catch(error => {
    if(error) {
      utils.logger.log({
        level: "error",
        message: error.message,
        stack: error.stack,
        userID,
        api,
        isLoggedIn: true
      })
    }
    res.sendStatus(500)
  })
})



module.exports = {
  router
};
