const express = require('express')
const router = express.Router();
const port = 3000
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
const logger = require("../../utils").logger;
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
    if (rows[0]) {
      res.status(400).send("An account with that email already exists!");
      hasReturned = true;
    } else {
      return await con.query(`INSERT INTO users (createdAt, discord, email, password, username) VALUES (?, ?, ?, ?, ?)`, [new Date(), discord, email, hash, username])
    }
  }).then(async row => {
    if (hasReturned === false) {
      return await con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [row.insertId, "[ICE] Member"])
    }
  }).catch(error => {
    if (error) {
      if (hasReturned === false) {
        res.status(500).send("A server error has occurred! Please try again.");
        hasReturned = true;
      }
      logger.log({
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
      return await con.query(`SELECT * FROM tokens WHERE id = ?`, [userID]) // Check if they have an existing token...
    } else {
      res.status(401).send("Please provide a valid email and password!"); // Invalid Credentials
      hasReturned = true;
    }
  }).then(async rows => {
    accessToken = generateAccessToken(userID)
    if (rows[0]) { // If they have an existing token...
      refreshToken = rows[0].token;
    } else { // If they don't have an existing token...
      refreshToken = jwt.sign(userID, jwt_refresh_secret);
      return await con.query(`INSERT INTO tokens (token, id) VALUES (?, ?)`, [refreshToken, userID])
    }
    res.json({accessToken, refreshToken})
    hasReturned = true;
  }).catch(error => {
    if (error) {
      if (hasReturned === false) {
        res.status(500).send("A server error has occurred! Please try again.");
        hasReturned = true;
      }
      logger.log({
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

// POST: Current User / Fetch Current User
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
      let user = await getUser(req, res, next, userID);
      if(user) {
        res.json(user);
      }
    } else {
      res.sendStatus(401);
      hasReturned = true;
    }
  })
})


// POST: /api/v1/user/refresh_token
// Params: none
// Body: refreshToken
// Return: accessToken
router.post('/refresh_token', async (req, res) => {
  const {refreshToken} = req.body;
  const con = req.app.get('con');
  if (!refreshToken) return res.status(401).send("Please login and provide an id!");
  await con.query(`SELECT * FROM tokens WHERE token = ?`, [refreshToken]).then(async rows => {
    if (rows[0]) {
      res.json({accessToken: await generateAccessToken(rows[0].id)})
    } else {
      res.sendStatus(401);
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
  }).catch(error => {
    if (error) {
      if (hasReturned === false) {
        res.status(500).send("A server error has occurred! Please try again.");
        hasReturned = true;
      }
      logger.log({
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
  return jwt.sign({id}, jwt_secret, {expiresIn: '15s'})
}


module.exports = {
  router
};
