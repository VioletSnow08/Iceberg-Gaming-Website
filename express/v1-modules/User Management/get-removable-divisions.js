const utils = require("../../../utils")
module.exports.index = function (req, res, canUserRemoveUser) {
  let {accessToken, userID} = req.body;
  const api = "/api/v1/user-management/get-removable-divisions"
  const con = req.app.get('con');
  if (!accessToken || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken and a userID.");
  const currentRoles = req.user.roles;
  let usersRoles = [];
  con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]).then(rows => {
    rows.forEach(row => {
      usersRoles.push(row.role);
    })
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
    if(userID !== req.user.id) {
      if (canUserRemoveUser(currentRoles, "Iceberg", usersRoles)) removableDivisions[0].removable = true;
      if (canUserRemoveUser(currentRoles, "17th", usersRoles)) removableDivisions[1].removable = true;
      if (canUserRemoveUser(currentRoles, "CGS", usersRoles)) removableDivisions[2].removable = true;
    }
    res.json(removableDivisions);
  }).catch(error => {
    if(error) {
      utils.logger.log({
        level: "error",
        message: error.message,
        stack: error.stack,
        isLoggedIn: true,
        userID: req.user.id,
        other: {
          userID,
          usersRoles
        },
        api
      })
    }
  })
}
