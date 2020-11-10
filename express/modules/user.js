const express = require('express')
const router = express.Router();
const port = 3000
const logger = require("../../utils").logger;
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');


// POST: /api/v1/user/login
// Params: none
// Body: email, password
// Return: accessToken, refreshToken
router.post('/login', async (req, res) => {
  const con = req.app.get('con');
  const {email, password} = req.body;
  if (!email || !password) return res.status(401).send("Please provide an email and password!");
  const hash = md5(password);
  await con.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, hash], async (error, results) => { // Validate User
    if (error) {
      res.sendStatus(503);
      throw error;
    } else if (results[0]) { // If user...
      const userID = results[0].id;
      const accessToken = generateAccessToken(userID);
      let refreshToken = jwt.sign(userID, jwt_refresh_secret);
      await con.query(`SELECT * FROM tokens WHERE token = ? AND id = ?`, [refreshToken, userID], async (e, r) => { // Check for a refresh token in the DB
        if (e) {
          res.sendStatus(500);
          throw e;
        } else if (r[0]) { // If a refresh token is in the database...
          refreshToken = r[0].token;
          res.json({accessToken, refreshToken});
        } else { // If there is no refresh token in the database...
          await con.query(`INSERT INTO tokens (token, id) VALUES (?, ?)`, [refreshToken, userID], (err, result) => {
            if (err) {
              res.sendStatus(500);
              throw err;
            } else {
              res.json({accessToken, refreshToken});
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
  await con.query(`SELECT * FROM tokens WHERE token = ?`, [refreshToken], async (error, results) => {
    if (error) {
      res.sendStatus(500);
      throw error;
    } else if (results[0]) {
      await con.query(`SELECT * FROM users JOIN user_roles ON users.id = user_roles.id WHERE users.id = ?`, [results[0].id], (err, result) => {
        if (err) {
          res.sendStatus(500);
          throw err;
        } else if (result[0]) {
          let user = result[0];
          let roles = [];
          result.forEach(r => {
            roles.push(r.role);
          })
          let safeUser = {
            id: user.id,
            createdAt: user.createdAt,
            discord: user.discord,
            email: user.email,
            onLOA: user.onLOA,
            photoURL: user.photoURL,
            status: user.status,
            username: user.username,
            roles
          }
          res.json(safeUser);
        } else {
          res.sendStatus(404); // User not found
        }
      })
    } else {
      res.status(503);
    }
  })
})


// POST: /api/v1/user/refresh_token
// Params: none
// Body: refreshToken
// Return: accessToken
router.post('/refresh_token', async (req, res) => {
  const con = req.app.get('con');
  const {refreshToken} = req.body;
  if (!refreshToken) return res.status(401).send("Please login and provide an id!");
  console.log("Refreshed Token!");
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
