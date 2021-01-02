const utils = require("../../../utils")
module.exports.index = function(req, res, VALID_REMOVE_ROLES) {
  let {accessToken, userID} = req.body;
  const api = "/api/v1/user-management/get-removable-divisions"
  if (!accessToken || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken and a userID.");
  const currentRoles = req.user.roles;
  let removableDivisions = [
    {
      division: "Iceberg",
      removable: false
    },
    {
      division: "17th",
      removable: false
    },
    {
      division: "CGS",
      removable: false
    }
  ];
  if (utils.doesUserContainRoles(currentRoles, VALID_REMOVE_ROLES.ICEBERG)) removableDivisions[0].removable = true;
  if (utils.doesUserContainRoles(currentRoles, VALID_REMOVE_ROLES.BCT)) removableDivisions[1].removable = true;
  if (utils.doesUserContainRoles(currentRoles, VALID_REMOVE_ROLES.CGS)) removableDivisions[2].removable = true;
  res.json(removableDivisions);
}
