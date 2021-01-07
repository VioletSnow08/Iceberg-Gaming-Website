const utils = require("../../../utils");
module.exports.index = function(req, res, VALID_REMOVE_ROLES, canUserRemoveUser) {
  let {accessToken, userID, division} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/change-roles"
  if (!accessToken || !userID || !division) return res.status(400).send("Bad Request! Please pass in an accessToken, userID, and a division!");
  let currentRoles = req.user.roles;

}
