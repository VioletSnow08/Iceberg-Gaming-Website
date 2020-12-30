const express = require('express')
const router = express.Router();
const port = 3000
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
const utils = require("../../utils");
const {DateTime} = require("luxon");
const {getUser} = require("../middleware/auth");

// POST: /api/v1/user/register
// Params: none
// Body: email, password, username, discord
// Return: <status code>
router.post('/register', async (req, res) => {
  const {email, password, username, discord} = req.body;
  const api = "/api/v1/user/register";
  const con = req.app.get('con');
  let hasReturned = false;
  if (!email || !password || !username || !discord) {
    return res.status(400).send("Please provide an email, password, username, and Discord Username and Tag!")
  }
  const hash = md5(password);
  await con.query(`SELECT * FROM users WHERE email = ?`, [email]).then(async rows => {
    utils.logger.log({
      level: "info",
      message: "Fetched User",
      email,
      api,
      isLoggedIn: false
    })
    if (rows[0]) {
      res.status(400).send("An account with that email already exists!");
      hasReturned = true;
    } else {
      let createdAt = DateTime.local().setZone('America/Chicago').toISO();
      return await con.query(`INSERT INTO users (createdAt, discord, email, password, username) VALUES (?, ?, ?, ?, ?)`, [createdAt, discord, email, hash, username])
    }
  }).then(async row => {
    if (hasReturned === false) {
      return await con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [row.insertId, "[ICE] Applicant"])
    }
  }).catch(error => {
    if (error) {
      if (hasReturned === false) {
        res.status(500).send("A server error has occurred! Please try again.");
        hasReturned = true;
      }
      utils.logger.log({
        level: "emergency",
        message: error.message,
        stack: error.stack,
        isLoggedIn: false,
        email,
        username,
        discord,
        api,
      })
    }
  })
  if (hasReturned === false) {
    res.send();
    utils.logger.log({
      level: "info",
      message: "Registered User",
      email,
      username,
      isLoggedIn: false,
      api
    })
  }
})
// POST: /api/v1/user/login
// Params: none
// Body: email, password
// Return: accessToken, refreshToken
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  let hasReturned = false;
  if (!email || !password) {
    return res.status(401).send("Please provide an email and password!")
  }
  const api = "/api/v1/user/login";
  const con = req.app.get('con');
  const hash = md5(password);
  let accessToken;
  let refreshToken;
  let userID;
  await con.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, hash]).then(async rows => {
    if (rows[0]) {
      userID = rows[0].id;
      utils.logger.log({
        level: "info",
        message: "Fetched User",
        email,
        api,
        isLoggedIn: false
      })
      return await con.query(`SELECT * FROM tokens WHERE id = ?`, [userID]) // Check if they have an existing token...
    } else {
      res.status(401).send("Please provide a valid email and password!"); // Invalid Credentials
      hasReturned = true;
    }
  }).then(async rows => {
    accessToken = generateAccessToken(userID)
    if (!hasReturned && rows[0]) { // If they have an existing token...
      refreshToken = rows[0].token;
    } else { // If they don't have an existing token...
      refreshToken = jwt.sign(userID, jwt_refresh_secret);
      return await con.query(`INSERT INTO tokens (token, id) VALUES (?, ?)`, [refreshToken, userID])
    }
    utils.logger.log({
      level: "info",
      message: "User Logged In",
      email,
      api,
      isLoggedIn: false
    })
    res.json({accessToken, refreshToken})
    hasReturned = true;
  }).catch(error => {
    if (error) {
      if (hasReturned === false) {
        res.status(500).send("A server error has occurred! Please try again.");
        hasReturned = true;
      }
      utils.logger.log({
        level: "emergency",
        message: error.message,
        stack: error.stack,
        isLoggedIn: false,
        id: userID,
        api,
      })
    }
  })
})

// POST: /api/v1/user/
// Params: none
// Body: refreshToken
// Return: user
router.post('/', async (req, res, next) => {
  const api = "/api/v1/user/";
  const con = req.app.get('con');
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).send("Please login!");
  let userID;
  let safeUser;
  let apps;
  let hasReturned = false;
  await con.query(`SELECT * FROM tokens WHERE token = ?`, [refreshToken]).then(async rows => {
    if (!hasReturned && rows[0]) { // If there is a refresh token... (required)
      userID = rows[0].id;
      getUser(con, userID).then(user => {
        if (user) {
          res.json(user);
          utils.logger.log({
            level: "info",
            message: "Current User Fetched",
            api,
            refreshToken,
            userID,
            isLoggedIn: true
          })
        } else res.sendStatus(400);
      })
    } else {
      res.sendStatus(401);
      hasReturned = true;
      utils.logger.log({
        level: "info",
        message: "Attempted to fetch current user with invalid token",
        isLoggedIn: false,
        userID: null,
        api,
        refreshToken
      })
    }
  })
})
// POST: /api/v1/user/all
// Params: none
// Body: refreshToken
// Return: user
router.post('/all', async (req, res, next) => {
  const api = "/api/v1/user/all";
  const con = req.app.get('con');
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).send("Please login!");
  let safeUsers = [];
  let hasReturned = false;
  await con.query(`SELECT * FROM tokens WHERE token = ?`, [refreshToken]).then(async rows => {
    if (rows[0]) { // If there is a refresh token... (required)
      return await con.query(`SELECT * FROM users`)
    } else {
      res.sendStatus(401);
      utils.logger.log({
        level: "info",
        message: "Attempted to fetch users with invalid token",
        isLoggedIn: false,
        userID: null,
        api,
        refreshToken
      })
      hasReturned = true;
    }
  }).then(async rows => {
    if (!hasReturned && rows) {
      for (let i = 0; i < rows.length; i++) {
        let id = rows[i].id;
        if (hasReturned) break;
        await getUser(con, id).then(user => {
          safeUsers.push(user);
        }).catch(() => {})
      }
    }
    res.json(safeUsers);
  })
})


// POST: /api/v1/user/refresh_token
// Params: none
// Body: refreshToken
// Return: accessToken
router.post('/refresh_token', async (req, res) => {
  const {refreshToken} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user/refresh_token";
  if (!refreshToken) return res.status(401).send("Please login and provide an id!");
  await con.query(`SELECT * FROM tokens WHERE token = ?`, [refreshToken]).then(async rows => {
    if (rows[0]) {
      let accessToken = await generateAccessToken(rows[0].id)
      res.json({accessToken})
      utils.logger.log({
        level: "info",
        message: "Generated Access Token",
        accessToken,
        refreshToken,
        userID: rows[0].id,
        isLoggedIn: true,
        api
      })
    } else {
      res.sendStatus(401);
      utils.logger.log({
        level: "info",
        message: "Failed to generate Access Token",
        refreshToken,
        userID: null,
        isLoggedIn: false,
        api
      })
    }
  })
})

// DELETE: /api/v1/user/logout
// Params: none
// Body: refreshToken, id
// Returns: 200 status code
router.delete('/logout', async (req, res) => {
  const {refreshToken, id} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user/logout";
  let hasReturned = false;
  if (!refreshToken || !id) return res.status(401).send("Please login and provide an id!");

  await con.query(`SELECT * FROM tokens WHERE token = ? AND id = ?`, [refreshToken, id]).then(async rows => {
    if (rows[0]) {
      return await con.query(`DELETE FROM tokens WHERE token = ? AND id = ?`, [refreshToken, id])
    } else {
      res.sendStatus(401);
      hasReturned = true;
    }
  }).then(async () => {
    hasReturned = true;
    res.sendStatus(200);
    utils.logger.log({
      level: "info",
      message: "User logged out",
      isLoggedIn: false,
      refreshToken,
      userID: id,
      api
    })
  }).catch(error => {
    if (error) {
      if (hasReturned === false) {
        res.status(500).send("A server error has occurred! Please try again.");
        hasReturned = true;
      }
      utils.logger.log({
        level: "emergency",
        message: error.message,
        stack: error.stack,
        isLoggedIn: false,
        id,
        api,
      })
    }
  })
})

function generateAccessToken(id) {
  return jwt.sign({id}, jwt_secret, {expiresIn: '10m'})
}


module.exports = {
  router
};
