const express = require('express')
const router = express.Router();
const port = 3000
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
const logger = require("../utils").logger;


// POST: /api/v1/user/login
// Params: none
// Body: email, password
// Return: accessToken, refreshToken
router.post('/login', async (req, res) => {
  const api = "/api/v1/user/login";
  const con = req.app.get('con');
  const {email, password} = req.body;
  if (!email || !password) return res.status(401).send("Please provide an email and password!");
  const hash = md5(password);
  await con.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, hash], async (error, results) => { // Validate User
    if (error) {
      res.sendStatus(503);
      logger.log({
        level: "emergency",
        message: error.message,
        stack: error.stack,
        isLoggedIn: false,
        id: null,
        api
      })
    } else if (results[0]) { // If user...
      const userID = results[0].id;
      const accessToken = generateAccessToken(userID);
      let refreshToken = jwt.sign(userID, jwt_refresh_secret);
      await con.query(`SELECT * FROM tokens WHERE token = ? AND id = ?`, [refreshToken, userID], async (e, r) => { // Check for a refresh token in the DB
        if (e) {
          res.sendStatus(500);
          logger.log({
            level: "emergency",
            message: e.message,
            stack: e.stack,
            isLoggedIn: false,
            id: results[0].id,
            api
          })
        } else if (r[0]) { // If a refresh token is in the database...
          refreshToken = r[0].token;
          res.json({accessToken, refreshToken});
          logger.log({
            level: "info",
            message: "User logged in successfully",
            isLoggedIn: true,
            id: results[0].id,
            refreshToken,
            accessToken,
            api,
            notes: "No new refreshToken was generated"
          })
        } else { // If there is no refresh token in the database...
          await con.query(`INSERT INTO tokens (token, id) VALUES (?, ?)`, [refreshToken, userID], (err, result) => {
            if (err) {
              res.sendStatus(500);
              logger.log({
                level: "emergency",
                message: error.message,
                stack: error.stack,
                isLoggedIn: false,
                id: results[0].id,
                api,
                refreshToken,
                accessToken
              })
            } else {
              res.json({accessToken, refreshToken});
              logger.log({
                level: "info",
                message: "User logged in successfully",
                isLoggedIn: true,
                id: results[0].id,
                refreshToken,
                accessToken,
                api,
                notes: "A new refreshToken was generated"
              })
            }
          })
        }
      })
    } else {
      res.status(401).send("Please provide a valid email and password!");
    }
  })
})

// POST: Current User / Fetch Current User
// Params: none
// Body: refreshToken
// Return: user
router.post('/', async (req, res) => {
  const con = req.app.get('con');
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.status(401).send("Please login!");
  await con.query(`SELECT * FROM tokens WHERE token = ?`, [refreshToken], (error, results) => {
    if(error) {
      res.sendStatus(500);
      throw error;
    } else if(results[0]) {

    }

  })
  // TODO: Check for token
  // TODO: Check if token is valid
  // TODO: If token is valid, check if user exists
  // TODO: If user exists, check for roles
  // TODO: If Roles, check for 17th Member
  // TODO: If 17th Member, add the 17th Row to their user object
  // TODO: Remove password from returned user data/object
})


// POST: /api/v1/user/refresh_token
// Params: none
// Body: refreshToken
// Return: accessToken
router.post('/refresh_token', async (req, res) => {
  const con = req.app.get('con');
  const {refreshToken} = req.body;
  if (!refreshToken) return res.status(401).send("Please login and provide an id!");
  await con.query(`SELECT * FROM tokens WHERE token = ?`, [refreshToken], (error, results) => {
    if (error) {
      res.sendStatus(503);
      throw error;
    } else if (results[0]) {
      const accessToken = generateAccessToken(results[0].id);
      res.json({accessToken})
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
  const con = req.app.get('con');
  const {refreshToken, id} = req.body;
  if (!refreshToken || !id) return res.status(401).send("Please login and provide an id!");
  await con.query(`SELECT * FROM tokens WHERE token = ? AND id = ?`, [refreshToken, id], async (error, results) => { // If token exists...
    if (error) {
      res.sendStatus(503);
    } else if (results[0]) {
      await con.query(`DELETE FROM tokens WHERE token = ? AND id = ?`, [refreshToken, id], (err) => { // Then delete the token
        if (err) {
          res.sendStatus(503);
          throw err;
        } else {
          res.sendStatus(200);
        }
      })
    } else {
      res.sendStatus(404);
    }
  })
})

function generateAccessToken(id) {
  return jwt.sign({id}, jwt_secret, {expiresIn: '15s'})
}
module.exports = {
  router
};
