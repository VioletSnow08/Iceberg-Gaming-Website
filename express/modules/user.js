const express = require('express')
const router = express.Router();
const port = 3000
const logger = require("../../utils").logger;
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");


router.post('/login/', async (req, res) => {
  let con = req.app.get('con');
  let {email, password} = req.body;
  if (!email || !password) {
    return res.sendStatus(401);
  }
  let hash = await md5(password);
  await con.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, hash], async (error, results) => {
    if (error) throw error;
    if (results[0]) {
      let user = results[0];
      let safeUser = { // Excludes the password
        id: user.id,
        createdAt: user.createdAt,
        discord: user.discord,
        email: user.email,
        onLOA: user.onLOA,
        photoURL: user.photoURL,
        status: user.status,
        username: user.username
      }
      let accessToken = generateAccessToken(user.id);
      let refreshToken = jwt.sign({id: user.id}, jwt_refresh_secret);
      await con.query(`SELECT * FROM tokens WHERE id = ?`, [user.id], async (e, r) => {
        if (e) throw e;
        if (r[0]) {
          refreshToken = r[0].token;
          safeUser = {
            ...safeUser,
            accessToken,
            refreshToken
          }
        } else {
          await con.query(`INSERT INTO tokens (token, id) VALUES (?, ?)`, [refreshToken, user.id], (err, res) => {
            if (err) throw err;
          })
          safeUser = {
            ...safeUser,
            accessToken,
            refreshToken
          }
        }
        return res.json(safeUser);
      })

    } else {
      return res.status(404).send("User not found! Please enter a proper email and password.");
    }


  })
})
router.post('/refresh_token', (req, res) => {
  const refreshToken = req.body.token;
  let con = req.app.get('con')
  if (!refreshToken) {
    return res.sendStatus(401);
  }
  con.query(`SELECT * FROM tokens WHERE token = ?`, [refreshToken], (error, results) => {
    if (error) throw error;
    if (results[0]) {
      jwt.verify(refreshToken, jwt_refresh_secret, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({id: user.id});
        res.json({accessToken})
      })
    } else {
      return res.sendStatus(403);
    }
  })
});

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, jwt_secret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

function generateAccessToken(id) {
  return jwt.sign({id}, jwt_secret, {expiresIn: '15s'})
}


module.exports = {
  router
};
