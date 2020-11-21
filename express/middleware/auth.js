const jwt = require("jsonwebtoken");
const {jwt_secret} = require("../../credentials");
const {logger} = require("../../utils");



async function requiresAuth(req, res, next) {
  const accessToken = req.body.accessToken;
  const con = req.app.get('con');
  if(accessToken) {
    jwt.verify(accessToken, jwt_secret, async (error, decodedToken) => {
      if(error) {
        logger.log({
          level: "info",
          message: error.message,
          isLoggedIn: false,
          id: null,
          api: "Requires Auth - Middleware"
        })
        res.sendStatus(400);
      } else {
        await con.query(`SELECT * FROM users WHERE id = ?`, [decodedToken.id]).then(rows => {
          if(rows[0]) {
            req.userID = decodedToken.id;
            next();
          } else {
            res.status(401).send("Invalid accessToken!");
          }
        }).catch(e => {
          if(e) {
            logger.log({
              level: "emergency",
              message: e.message,
              stack: e.stack,
              isLoggedIn: false,
              id: null,
              api: "Requires Auth - Middleware"
            })
            res.sendStatus(500);
          }
        })
      }
    })
  } else {
    res.status(401).send("Please provide an accessToken!");
  }
}


module.exports = {
  requiresAuth
}
