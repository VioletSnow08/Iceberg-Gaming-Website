const jwt = require("jsonwebtoken");
const {jwt_secret} = require("../../credentials");
const {logger} = require("../../utils");


async function requiresAuth(req, res, next) {
  const accessToken = req.body.accessToken;
  const con = req.app.get('con');
  if (accessToken) {
    jwt.verify(accessToken, jwt_secret, async (error, decodedToken) => {
      if (error) {
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
          if (rows[0]) {
            getUser(req, res, next, decodedToken.id).then(user => {
              if (user) {
                req.user = user;
                next();
              }
            }).catch({})
          } else {
            res.status(401).send("Invalid accessToken!");
          }
        }).catch(e => {
          if (e) {
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
  let user;
  let apps = [];
  let roles = [];
  let loas = [];
  let bctMemberRows = [];
  let errorCode;
  let errorMessage = "";
  let caughtError;
  await con.query(`SELECT * FROM users WHERE id = ?`, [userID]).then(async rows => {
    if (!errorCode && rows[0]) { // If there is a user... (required)
      user = rows[0];
      return await con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]);
    } else {
      errorCode = 401;
    }
  }).then(async rows => {
    if (!errorCode && rows[0]) { // If the user has roles... (required)
      rows.forEach(role => {
        roles.push(role);
      })
      user.roles = roles;
      return await con.query(`SELECT * FROM 17th_members WHERE userID = ? ORDER BY createdAt desc`, [userID])
    } else {
      errorCode = 401;
    }
  }).then(async rows => {
    if (!errorCode && rows[0]) { // If the user has any 17th Member Rows (not required)
      rows.forEach(row => {
        bctMemberRows.push(row);
      })
      user.bct = bctMemberRows;
    }
    return await con.query(`SELECT * FROM iceberg_applications WHERE userID = ?`, [userID])
  }).then(async rows => {
    if (!errorCode && rows[0]) { // If the user has any Iceberg Applications (not required)
      rows.forEach(row => {
        apps.push(row);
      })
      // Is not added to the user because we have the 17th Applications to add to the array still...
    }
    return await con.query(`SELECT * FROM 17th_applications WHERE userID = ?`, [userID])
  }).then(async rows => {
    if (!errorCode && rows[0]) { // If the user has any 17th BCT Applications (not required)
      rows.forEach(row => {
        apps.push(row);
      })
      user.applications = apps;
    }
    return await con.query(`SELECT * FROM loas WHERE userID = ?`, [userID])
  }).then(async rows => {
    if (!errorCode && rows[0]) {
      rows.forEach(row => {
        loas.push(row);
      })
      user.loas = loas;
    }
  }).catch(error => {
    if (error) {
      errorCode = 500;
      errorMessage = "An error has occurred, please try again."
      caughtError = error;
      logger.log({
        level: "emergency",
        message: error.message,
        stack: error.stack,
        isLoggedIn: false,
        id: userID,
        api: "Get User - Middleware",
      })
    }
  })
  let promise = new Promise(function (resolve, reject) {
    if (user && !errorCode) {
      let safeUser = {
        id: user.id,
        createdAt: user.createdAt,
        discord: user.discord,
        email: user.email,
        photoURL: user.photoURL,
        status: user.status,
        username: user.username,
        isDeleted: user.isDeleted,
        applications: apps,
        roles,
        bct: bctMemberRows,
        loas
      }
      resolve(safeUser);
    }
    else {
      res.status(errorCode).send(errorMessage);
      reject(caughtError);
    }
    ;
  });
  return promise;
}

module.exports = {
  requiresAuth,
  getUser
}
