const express = require('express')
const router = express.Router();
const port = 3000
const logger = require("../../utils").logger;
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");

router.post('/login', async (req, res) => {
  const con = req.app.get('con');
  const {email, password} = req.body;
  const hash = md5(password);
  await con.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, hash], async (error, results) => {
    if(error) {
      res.sendStatus(403);
      throw error;
    } else if(results[0]) {
      const accessToken = generateAccessToken(results[0].id);
      const refreshToken = jwt.sign(results[0].id, jwt_refresh_secret);
      await con.query(`INSERT INTO tokens (token, id) VALUES (?, ?)`, [refreshToken, results[0].id], (err, result) => {
        if(err) {
          res.sendStatus(500);
          throw err;
        } else {
          res.json({accessToken, refreshToken});
        }
      })
    } else {
      res.status(401).send("Please provide a valid email and password!");
    }
  })

})



// POST: /api/v1/user/refresh_token
// Params: none
// Body: refreshToken
router.post('/refresh_token', async (req, res) => {
  const con = req.app.get('con');
  const refreshToken = req.body.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  await con.query(`SELECT * FROM tokens WHERE token = ?`, [refreshToken], (error, results) => {
    if (error) {
      res.sendStatus(403);
      throw error;
    } else if (results[0]) {
      const accessToken = generateAccessToken(results[0].token)
      res.json({accessToken})
    } else {
      res.sendStatus(401);
    }
  })
})

router.delete('/logout', async (req, res) => {
  const con = req.app.get('con');
  const refreshToken = req.body.refreshToken;
  await con.query(`DELETE FROM tokens WHERE token = ? AND EXISTS(SELECT * FROM tokens WHERE token = ?`, [refreshToken, refreshToken], (error, results) => {
    if(error) {
      res.sendStatus(403);
      throw error;
    }
    return res.send("Success!")
  })
})
function generateAccessToken(id) {
  return jwt.sign({id}, jwt_secret, {expiresIn: '15s'})
}


module.exports = {
  router
};
