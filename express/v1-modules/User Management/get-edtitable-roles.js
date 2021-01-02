const utils = require("../../../utils")
module.exports.index = function(req, res, displayedEditableRoles, canUserChangeRole) {
  let {accessToken, userID} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/get-editable-roles"
  if (!accessToken || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken and a userID.");
  const currentRoles = req.user.roles;
  let returnedRoles = [];
  con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]).then(rows => {
    let roles = [];
    rows.forEach(row => {
      roles.push(row.role);
    })
    displayedEditableRoles.forEach(role => {
      returnedRoles.push({
        role,
        doesUserHaveIt: utils.doesUserContainRoles(roles, role),
        isDisabled: !canUserChangeRole(currentRoles, role)
      })
    })

    utils.logger.log({
      level: "info",
      message: "User's Roles Fetched",
      userID: req.user.id,
      passedInUserID: userID,
      accessToken,
      currentRoles,
      returnedRoles,
      isLoggedIn: true,
      api
    })
    res.json(returnedRoles);
  })
}
