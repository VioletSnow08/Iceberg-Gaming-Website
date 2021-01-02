const utils = require("../../../../utils");
module.exports.index = function(req, res, REQUIRED_ROLES) {
  let {accessToken, comment, punishment, id} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/administrative/disciplinary-action/view"
  if (!accessToken || !comment || !id ) return res.status(400).send("Bad Request! Please pass in ALL fields in the body.");
  if(utils.doesUserContainRoles(req.user.roles, REQUIRED_ROLES)) {
    con.query(`UPDATE disciplinary_action_forms SET comment = ?, actualPunishment = ?, whoPunished = ? WHERE id = ?`, [comment, punishment, userID, id]).then(() => {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "Updated Disciplinary Action Form",
        isLoggedIn: true,
        userID,
        api,
        accessToken
      })
    }).catch(error => {
      if(error) {
        res.sendStatus(500);
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID,
          api,
          accessToken
        })
      }
    })
  } else res.sendStatus(401);
}
