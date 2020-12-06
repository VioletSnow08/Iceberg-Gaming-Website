const jwt = require("jsonwebtoken");
const {jwt_secret} = require("../../credentials");
const utils = require("../../utils");


async function requiresAuth(req, res, next) {
  const accessToken = req.body.accessToken;
  const con = req.app.get('con');
  console.log(accessToken);
  if (accessToken) {
    jwt.verify(accessToken, jwt_secret, async (error, decodedToken) => {
      if (error) {
        utils.logger.log({
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
            getUser(con, decodedToken.id).then(user => {
              if (user) {
                req.user = user;
                next();
              }
            }).catch(error => {
              if(error) {
                res.status(401).send("Oops! An error has occurred.");
              }
            })
          } else {
            res.status(401).send("Invalid accessToken!");
          }
        }).catch(e => {
          if (e) {
            utils.logger.log({
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

async function getUser(con, userID) {
  let user;
  let apps = [];
  let roles = [];
  let loas = [];
  let bctMemberRows = [];
  let hasReturned;
  let errorMessage = "";
  let caughtError;
  await con.query(`SELECT * FROM users WHERE id = ?`, [userID]).then(async rows => {
    if (!hasReturned && rows[0]) { // If there is a user... (required)
      user = rows[0];
      return await con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]);
    } else {
      hasReturned = true;
    }
  }).then(async rows => {
    if (!hasReturned && rows[0]) { // If the user has roles... (required)
      rows.forEach(row => {
        roles.push(row.role);
      })
      user.roles = roles;
      return await con.query(`SELECT * FROM 17th_members WHERE userID = ? ORDER BY createdAt desc`, [userID])
    } else {
      hasReturned = true;
    }
  }).then(async rows => {
    if (!hasReturned && rows[0]) { // If the user has any 17th Member Rows (not required)
      rows.forEach(row => {
        bctMemberRows.push(row);
      })
      user.bct = bctMemberRows;
    }
    return await con.query(`SELECT * FROM iceberg_applications WHERE userID = ? ORDER BY createdAt desc`, [userID])
  }).then(async rows => {
    if (!hasReturned && rows[0]) { // If the user has any Iceberg Applications (not required)
      rows.forEach(row => {
        apps.push(row);
      })
      // Is not added to the user because we have the 17th Applications to add to the array still...
    }
    return await con.query(`SELECT * FROM 17th_applications WHERE userID = ? ORDER BY createdAt desc`, [userID])
  }).then(async rows => {
    if (!hasReturned && rows[0]) { // If the user has any 17th BCT Applications (not required)
      rows.forEach(row => {
        apps.push(row);
      })
      user.applications = apps;
    }
    return await con.query(`SELECT * FROM loas WHERE userID = ? ORDER BY startDate desc`, [userID])
  }).then(async rows => {
    if (!hasReturned && rows[0]) {
      rows.forEach(row => {
        loas.push(row);
      })
      user.loas = loas;
    }
  }).catch(error => {
    if (error) {
      caughtError = error;
      utils.logger.log({
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
    if (user && !hasReturned) {
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
    } else {
      reject(caughtError);
    };
  });
  return promise;
}

module.exports = {
  requiresAuth,
  getUser
}
