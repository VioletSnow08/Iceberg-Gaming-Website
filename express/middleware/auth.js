const jwt = require("jsonwebtoken");
const {jwt_secret} = require("../../credentials");
const {logger} = require("../../utils");



const requiresAuth = (req, res, next) => {
  const accessToken = req.body.accessToken;
  const con = req.app.get('con');
  if(accessToken) {
    jwt.verify(accessToken, jwt_secret, async (error, decodedToken) => {
      if(error) {
        logger.log({
          level: "emergency",
          message: error.message,
          stack: error.stack,
          isLoggedIn: false,
          id: null,
          api: "Requires Auth - Middleware"
        })
        res.sendStatus(500);
      } else {
        await con.query(`SELECT * FROM tokens WHERE id = ? AND user_id = ?`, [decodedToken.id, decodedToken.userID]).then(rows => {
          if(rows[0]) {
            next();
          }
        }).catch(error => {
          if(error) {
            logger.log({
              level: "emergency",
              message: error.message,
              stack: error.stack,
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
