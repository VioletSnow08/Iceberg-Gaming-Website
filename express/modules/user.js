const express = require('express')
const router = express.Router();
const port = 3000
const logger = require("../../utils").logger;
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");


// POST: /api/v1/user/login
// Params: none
// Body: email, password, uuid
router.post('/login', async (req, res) => {
  const con = req.app.get('con');
  const {email, password, uuid} = req.body;
  const hash = md5(password);
  await con.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, hash], async (error, results) => { // Validate User
    if (error) {
      res.sendStatus(503);
      throw error;
    } else if (results[0]) { // If user...
      const userID = results[0].id;
      const accessToken = generateAccessToken(userID);
      let refreshToken = jwt.sign(userID, jwt_refresh_secret);
      await con.query(`SELECT * FROM tokens WHERE token = ? AND id = ? AND uuid`, [refreshToken, userID, uuid], async (e, r) => { // Check for a refresh token in the DB
        if (e) {
          res.sendStatus(500);
          throw e;
        } else if (r[0]) { // If a refresh token is in the database...
          refreshToken = r[0].token;
          res.json({accessToken, refreshToken});
        } else { // If there is no refresh token in the database...
          await con.query(`INSERT INTO tokens (token, id, uuid) VALUES (?, ?, ?)`, [refreshToken, userID, uuid], (err, result) => {
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

router.post('/fetch_user', async (req, res) => {
  const con = req.app.get('con');

})


// POST: /api/v1/user/refresh_token
// Params: none
// Body: refreshToken, id, uuid
router.post('/refresh_token', async (req, res) => {
  const con = req.app.get('con');
  const {refreshToken, id, uuid} = req.body;
  if (refreshToken == null) return res.sendStatus(401);
  await con.query(`SELECT * FROM tokens WHERE token = ? AND id = ? AND uuid = ?`, [refreshToken, id, uuid], (error, results) => {
    if (error) {
      res.sendStatus(503);
      throw error;
    } else if (results[0]) {
      const accessToken = generateAccessToken(results[0].token)
      res.json({accessToken})
    } else {
      res.sendStatus(401);
    }
  })
})

// DELETE: /api/v1/user/logout
// Params: none
// Body: refreshToken, id, uuid
router.delete('/logout', async (req, res) => {
  const con = req.app.get('con');
  const {refreshToken, id, uuid} = req.body;
  await con.query(`SELECT * FROM tokens WHERE token = ? AND id = ? AND uuid = ?`, [refreshToken, id, uuid], async (error, results) => { // If token exists...
    if (error) {
      res.sendStatus(503);
    } else if (results[0]) {
      await con.query(`DELETE FROM tokens WHERE token = ? AND id = ? AND uuid = ?`, [refreshToken, id, uuid], (err) => { // Then delete the token
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
