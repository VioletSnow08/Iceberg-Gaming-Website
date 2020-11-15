const express = require('express')
const router = express.Router();
const port = 3000
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
const logger = require("../../utils").logger;


// POST: /api/v1/user/login
// Params: none
// Body: email, password
// Return: accessToken, refreshToken
router.post('/login', async (req, res) => {
  const {email, password} = req.body;
  if (!email || !password) return res.status(401).send("Please provide an email and password!");

  const api = "/api/v1/user/login";
  const con = req.app.get('con');
  const hash = md5(password);
  let accessToken;
  let refreshToken;
  let userID;
  await con.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, hash]).then(async rows => {
    if(rows[0]) {
      userID = rows[0].id;
      return await con.query(`SELECT * FROM tokens WHERE id = ?`, [userID]) // Check if they have an existing token...
    } else {
      res.status(401).send("Please provide a valid email and password!"); // Invalid Credentials
    }
  }).then(async rows => {
    accessToken = generateAccessToken(userID)
    if(rows[0]) { // If they have an existing token...
      refreshToken = rows[0].token;
      res.json({accessToken, refreshToken})
    } else { // If they don't have an existing token...
      refreshToken = jwt.sign(userID, jwt_refresh_secret);
      res.json({accessToken, refreshToken})
      return await con.query(`INSERT INTO tokens (token, id) VALUES (?, ?)`, [refreshToken, userID])
    }
  }).catch(error => {
    if(error) {
      res.sendStatus(500);
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
router.post('/', async (req, res) => {
  const api = "/api/v1/user/";
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).send("Please login!");

})


// POST: /api/v1/user/refresh_token
// Params: none
// Body: refreshToken
// Return: accessToken
router.post('/refresh_token', async (req, res) => {
  const {refreshToken} = req.body;
  if (!refreshToken) return res.status(401).send("Please login and provide an id!");
})

// DELETE: /api/v1/user/logout
// Params: none
// Body: refreshToken, id
// Returns: 200 status code
router.delete('/logout', async (req, res) => {
  const {refreshToken, id} = req.body;
  if (!refreshToken || !id) return res.status(401).send("Please login and provide an id!");

})

function generateAccessToken(id) {
  return jwt.sign({id}, jwt_secret, {expiresIn: '15s'})
}


module.exports = {
  router
};
