const utils = require("../../../utils");
module.exports.index = function(req, res, VALID_REMOVE_ROLES, canUserRemoveUser) {
  let {accessToken, userID, division} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/change-roles"
  if (!accessToken || !userID || !division) return res.status(400).send("Bad Request! Please pass in an accessToken, userID, and a division!");
  if(userID === req.user.id) return res.sendStatus(400); // They are trying to remove themselves
  let currentRoles = req.user.roles;
  let usersRoles = [];
  con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]).then(rows => {
    rows.forEach(row => {
      usersRoles.push(row.role);
    })
    switch(division.toLowerCase()) {
      case "iceberg":
        removeUserFrom17th({loggedInUserID: req.user.id, currentRoles}, {userID, usersRoles}, canUserRemoveUser, con, api);
    }
  })
}


function removeUserFrom17th({loggedInUserID, currentRoles}, {userID, usersRoles}, canUserRemoveUser, con, api) {
  if(canUserRemoveUser(currentRoles, "17th", usersRoles)) {
    usersRoles.forEach(role => {
      if(role.startsWith("[17th]")) {
        con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [userID, role]).then(() => {
          utils.logger.log({
            level: "info",
            message: "Role Removed",
            isLoggedIn: true,
            userID: loggedInUserID,
            currentRoles,
            other: {
              removedFrom: userID,
              roles: usersRoles
            },
            api
          })
        }).catch(error => {
          if(error) {
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID: loggedInUserID,
              api,
              currentRoles,
              other: {
                removedFrom: userID,
                roles: usersRoles
              }
            })
          }
        })
      }
    })
    utils.logger.log({
      level: "info",
      message: "User removed",
      division: "17th",
      isLoggedIn: true,
      userID: loggedInUserID,
      currentRoles,
      other: {
        removedUser: userID
      },
      api
    })
  }
}
