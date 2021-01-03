const utils = require("../../../utils");
module.exports.index = function(req, res, bctMessageApprove, bctMessageDeny, bctMessageProcess, icebergMessageApprove, icebergMessageProcess, icebergMessageDeny) {
  let {accessToken} = req.body;
  let {action, id, division} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/applications/" + action;
  let comment;
  let status;
  let applicantID;
  let subApplicationID;
  division = division.toLowerCase();
  action = action.toLowerCase();
  if (!accessToken || !action || !id || !division) return res.status(400).send("Bad Request! Please provide an accessToken, action, division, and id");
  if (action !== "approve" && action !== "deny" && action !== "process") return res.status(400).send("Bad Request! Please provide a valid action!");
  if (!utils.doesUserContainRoles(req.user.roles, ["[ICE] Recruiter", "[ICE] Admin", "[ICE] Owner", '[ICE] Webmaster'])) return res.status(401).send("Unauthorized!");
  con.query(`SELECT * FROM applications WHERE id = ?`, [id]).then(rows => {
    if (rows) {
      applicantID = rows[0].userID;
      subApplicationID = rows[0].applicationID;
      utils.logger.log({
        level: "info",
        message: "Application Fetched",
        api,
        userID,
        applicantID,
        accessToken,
        division,
        action,
        isLoggedIn: true
      })

      if (division === "17th" && action === "approve") {
        comment = bctMessageApprove(req);
        status = "Approved";
        con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [applicantID, '[ICE] Applicant']).then(() => {
          utils.logger.log({
            level: "info",
            message: "Deleted Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [applicantID, '[ICE] Member'])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Created Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [applicantID, '[17th] Member'])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Created Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`UPDATE 17th_applications SET comment = ?, status = ? WHERE userID = ? AND id = ?`, [comment, status, applicantID, subApplicationID])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if (error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              api,
              userID,
              accessToken,
              division,
              applicantID,
              subApplicationID,
              action,
              isLoggedIn: true
            })
          }
        })
      } else if (division === "17th" && action === "process") {
        comment = bctMessageProcess(req);
        status = "Processed";
        con.query(`UPDATE 17th_applications SET comment = ?, status = ? WHERE userID = ? AND id = ?`, [comment, status, applicantID, subApplicationID]).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if (error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              subApplicationID,
              division,
              id,
              action,
              api
            })
          }
        })
      } else if (division === "17th" && action === "deny") {
        comment = bctMessageDeny(req);
        status = "Denied";
        con.query(`UPDATE 17th_applications SET comment = ?, status = ? WHERE userID = ? AND id = ?`, [comment, status, applicantID, subApplicationID]).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if (error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              subApplicationID,
              division,
              id,
              action,
              api
            })
          }
        })
      } else if(division === "iceberg" && action === "approve") {
        comment = icebergMessageApprove(req);
        status = "Approved";
        con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [applicantID, '[ICE] Applicant']).then(() => {
          utils.logger.log({
            level: "info",
            message: "Deleted Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [applicantID, '[ICE] Member'])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Created Role",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          return con.query(`UPDATE iceberg_applications SET status = ?, comment = ? WHERE id = ? AND userID = ?`, [status, comment, subApplicationID, applicantID])
        }).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200)
        }).catch(error => {
          if(error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              division,
              id,
              subApplicationID,
              api
            })
          }
        })
      } else if(division === "iceberg" && action === "process") {
        comment = icebergMessageProcess(req);
        status = "Processed";
        con.query(`UPDATE iceberg_applications SET status = ?, comment = ? WHERE id = ? AND userID = ?`, [status, comment, subApplicationID, applicantID]).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if(error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              division,
              id,
              subApplicationID,
              api
            })
          }
        })
      } else if(division === "iceberg" && action === "deny") {
        comment = icebergMessageDeny(req);
        status = "Denied";
        con.query(`UPDATE iceberg_applications SET status = ?, comment = ? WHERE id = ? AND userID = ?`, [status, comment, subApplicationID, applicantID]).then(() => {
          utils.logger.log({
            level: "info",
            message: "Updated Application",
            isLoggedIn: true,
            userID,
            applicantID,
            accessToken,
            division,
            action,
            api
          })
          res.sendStatus(200);
        }).catch(error => {
          if(error) {
            res.sendStatus(500);
            utils.logger.log({
              level: "error",
              message: error.message,
              stack: error.stack,
              isLoggedIn: true,
              userID,
              applicantID,
              division,
              id,
              subApplicationID,
              api
            })
          }
        })
      } else res.sendStatus(400);
    } else {
      res.sendStatus(400);
    }
  }).catch(e => {
    if (e) {
      if (!res.headersSent) {
        res.sendStatus(500);
      }
      utils.logger.log({
        level: "error",
        message: e.message,
        stack: e.stack,
        api,
        userID,
        accessToken,
        division,
        action,
        isLoggedIn: true
      })
    }
  })
}
