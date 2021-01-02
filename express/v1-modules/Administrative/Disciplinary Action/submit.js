const utils = require("../../../../utils");
const {DateTime} = require("luxon");
module.exports.index = function(req, res) {
  let {accessToken, offender, division, date, whereDidThisOccur, witnesses, explanation, infraction, whatPunishment} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/administrative/disciplinary-action/submit"
  if (!accessToken || !offender || !division || !date || !whereDidThisOccur ||!witnesses || !explanation || !infraction || !whatPunishment) return res.status(400).send("Bad Request! Please pass in ALL fields in the body.");
  let createdAt = DateTime.local().setZone('America/Chicago').toISO();
  con.query(`INSERT INTO disciplinary_action_forms (userID, offender, division, date, whereDidThisOccur, witnesses, explanation, infraction, whatPunishment, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userID, offender, division, date, whereDidThisOccur, witnesses, explanation, infraction, whatPunishment, createdAt]).then(() => {
    res.sendStatus(200);
    utils.logger.log({
      level: "info",
      message: "Disciplinary Action Form Submitted",
      userID,
      offender,
      explanation,
      isLoggedIn: true,
      accessToken,
      api
    })
  }).catch(error => {
    if(error) {
      res.sendStatus(500)
      utils.logger.log({
        level: "emergency",
        message: error.message,
        stack: error.stack,
        isLoggedIn: true,
        userID,
        offender,
        explanation,
        accessToken,
        api
      })
    }
  })
}
