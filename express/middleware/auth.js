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
        res.status(400).send("JWT Expired!");
      } else {
        await con.query(`SELECT * FROM users WHERE id = ?`, [decodedToken.id]).then(async rows => {
          if(rows[0]) {
            let user = getUser(req, res, next, decodedToken.id)
            if(user) {
              req.user = user;
              next();
            } // else if handled in the function

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

async function getUser(req, res, next, userID) {
  const con = req.app.get('con');
  let safeUser;
  let apps;
  let hasReturned = false;
  await con.query(`SELECT * FROM users WHERE id = ?`, [userID]).then(async rows => {
    if (!hasReturned && rows[0]) { // If there is a user... (required)
      safeUser = rows[0];
      return await con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]);
    } else {
      res.sendStatus(401);
      hasReturned = true;
    }
  }).then(async rows => {
    let roles = [];
    if (!hasReturned && rows[0]) { // If the user has roles... (required)
      rows.forEach(role => {
        roles.push(role);
      })
      safeUser.roles = roles;
      return await con.query(`SELECT * FROM 17th_members WHERE userID = ? ORDER BY createdAt desc`, [userID])
    } else {
      res.sendStatus(401);
      hasReturned = true;
    }
  }).then(async rows => {
    if (!hasReturned && rows[0]) { // If the user has any 17th Member Rows (not required)
      safeUser.bct = rows;
    }
    return await con.query(`SELECT * FROM iceberg_applications WHERE userID = ?`, [userID])
  }).then(async rows => {
    if (!hasReturned && rows[0]) { // If the user has any Iceberg Applications (not required)
      rows.forEach(row => {
        apps.push(row);
      })
    }
    return await con.query(`SELECT * FROM 17th_applications WHERE userID = ?`, [userID])
  }).then(async rows => {
    if (!hasReturned && rows[0]) { // If the user has any 17th BCT Applications (not required)
      rows.forEach(row => {
        apps.push(row);
      })
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
        id: userID,
        api,
      })
    }
  })
  if (safeUser && !hasReturned) return safeUser;
  else if (!hasReturned) res.send(401);

}

module.exports = {
  requiresAuth,
  getUser
}
