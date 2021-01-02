const utils = require("../../../utils");
module.exports.index = function(req, res, canUserChangeRole) {
  let {accessToken, roles, userID} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/change-roles"
  if (!accessToken || !roles || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken, roles, and a userID.");
  let currentRoles = req.user.roles;
  con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]).then(rows => {
    let rolesTheUserHas = [];
    rows.forEach(row => {
      rolesTheUserHas.push(row.role);
    })
    roles.forEach(role => {
      if (canUserChangeRole(currentRoles, role.role)) { // Instead of me checking for a division, it checks for the role, which is defined in the beginning of the file.
        if (role.doesUserHaveIt) { // Meaning they either have it or want it(this is passed in by the front end)
          if (!utils.doesUserContainRoles(rolesTheUserHas, [role.role])) { // If they don't *have* the role, then give it to them...
            con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [userID, role.role]).then(() => {
              if (!res.headersSent) {
                res.sendStatus(200);
              }
              utils.logger.log({
                level: "info",
                message: "Role Created",
                userID,
                role,
                roles: currentRoles,
                isLoggedIn: true,
                api,
                accessToken
              })
            }).catch(error => {
              if (error) {
                if (!res.headersSent) {
                  res.sendStatus(500);
                }
                utils.logger.log({
                  level: "error",
                  message: error.message,
                  stack: error.stack,
                  userID,
                  role,
                  roles: currentRoles,
                  isLoggedIn: true,
                  api,
                  accessToken
                })
              }
            })
          }
        } else if (!role.doesUserHaveIt) { // Otherwise if they don't have it or want it delete the role...
          con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [userID, role.role]).then(() => {
            if (!res.headersSent) {
              res.sendStatus(200);
            }
            utils.logger.log({
              level: "info",
              message: "Role Deleted",
              userID,
              role,
              roles: currentRoles,
              isLoggedIn: true,
              api,
              accessToken
            })
          }).catch(error => {
            if (error) {
              if (!res.headersSent) {
                res.sendStatus(500);
              }
              utils.logger.log({
                level: "error",
                message: error.message,
                stack: error.stack,
                userID,
                role,
                roles: currentRoles,
                isLoggedIn: true,
                api,
                accessToken
              })
            }
          })
        }
      } else {
        if (!res.headersSent) {
          res.sendStatus(200);
        }
        utils.logger.log({
          level: "notice",
          message: "Attempt at removing roles without proper permissions",
          userID,
          role,
          roles: currentRoles,
          isLoggedIn: true,
          api,
          accessToken
        })
      }
    })
  }).catch(error => {
    if (error) {
      if (!res.headersSent) {
        res.sendStatus(500);
      }
      utils.logger.log({
        level: "error",
        message: error.message,
        stack: error.stack,
        userID,
        roles: currentRoles,
        isLoggedIn: true,
        api,
        accessToken
      })
    }
  })
}
