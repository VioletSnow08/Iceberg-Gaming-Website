const utils = require("../../../../utils");

module.exports.index = function(req, res, REQUIRED_ROLES) {
  let {accessToken} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/administrative/disciplinary-action"
  if (!accessToken) return res.status(400).send("Bad Request! Please pass in an accessToken!");
  if(utils.doesUserContainRoles(req.user.roles, REQUIRED_ROLES)) {
    con.query(`SELECT * FROM disciplinary_action_forms`).then(rows => {
      res.json(rows);
      utils.logger.log({
        level: "info",
        isLoggedIn: true,
        message: "Disciplinary Action Forms Fetched",
        userID,
        accessToken,
        api
      })
    }).catch(error => {
      if(error) {
        res.sendStatus(500);
        utils.logger.log({
          level: "error",
          isLoggedIn: true,
          message: error.message,
          stack: error.stack,
          userID,
          accessToken,
          api
        })
      }
    })
  } else {
    res.sendStatus(401);
    utils.logger.log({
      level: "notice",
      isLoggedIn: true,
      userID,
      accessToken,
      message: "User attempted accessing Disciplinary Action Forms",
      api
    })
  }
}
