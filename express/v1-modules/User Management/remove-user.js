const utils = require("../../../utils");
module.exports.index = function(req, res, VALID_REMOVE_ROLES) {
  let {accessToken, userID, division} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/change-roles"
  if (!accessToken || !userID || !division) return res.status(400).send("Bad Request! Please pass in an accessToken, userID, and a division!");
  let currentRoles = req.user.roles;
  if (division.toLowerCase() === "17th") { // 17th Brigade Combat Team
    if (utils.doesUserContainRoles(currentRoles, VALID_REMOVE_ROLES.BCT)) {
      con.query(`DELETE FROM 17th_members WHERE userID = ?`, [userID])
        .then(() => {
          return con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [userID, "[17th] Member"])
        }).then(() => {
        utils.logger.log({
          level: "info",
          message: "17th Member Deleted",
          isLoggedIn: true,
          userID: req.user.id,
          removedUser: userID,
          accessToken,
          api
        })
        res.sendStatus(200);
      }).catch(error => {
        if (error) {
          utils.logger.log({
            level: "error",
            message: error.message,
            stack: error.stack,
            isLoggedIn: true,
            userID: req.user.id,
            removedUser: userID,
            accessToken,
            api
          })
          res.sendStatus(400);
        }
      })
    } else res.sendStatus(401);
  } else if (division.toLowerCase() === "iceberg") { // Iceberg Gaming
    if (utils.doesUserContainRoles(currentRoles, VALID_REMOVE_ROLES.ICEBERG)) {
      con.query(`DELETE FROM user_roles WHERE userID = ?`, [userID]).then(() => {
        utils.logger.log({
          level: "info",
          message: "Iceberg Member Deleted",
          isLoggedIn: true,
          userID: req.user.id,
          removedUser: userID,
          accessToken,
          api
        })
        return con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [userID, '[ICE] Applicant'])
      }).then(() => {
        res.sendStatus(200);
      }).catch(error => {
        if (error) {
          utils.logger.log({
            level: "error",
            message: error.message,
            stack: error.stack,
            isLoggedIn: true,
            userID: req.user.id,
            removedUser: userID,
            accessToken,
            api
          })
          res.sendStatus(400);
        }
      })
    } else res.sendStatus(401);
  } else if (division.toLowerCase() === "cgs") { // Chryse Guard Security
    if (utils.doesUserContainRoles(currentRoles, VALID_REMOVE_ROLES.CGS)) {
      con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [userID, "[CGS] Member"]).then(() => {
        utils.logger.log({
          level: "info",
          message: "CGS Member Deleted",
          isLoggedIn: true,
          userID: req.user.id,
          removedUser: userID,
          accessToken,
          api
        })
        res.sendStatus(200);
      }).catch(error => {
        if (error) {
          utils.logger.log({
            level: "error",
            message: error.message,
            stack: error.stack,
            isLoggedIn: true,
            userID: req.user.id,
            removedUser: userID,
            accessToken,
            api
          })
          res.sendStatus(400);
        }
      })
    } else res.sendStatus(401); // Unauthorized; Can't remove that specific role...
  } else res.sendStatus(400) // Bad Request; Invalid division
}
