const utils = require("../../../utils");
module.exports.index = function(req, res) {
  let {accessToken} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/settings/applications"
  if (!accessToken) return res.status(400).send("Bad Request! Please pass in an accessToken.");
  let initialQueries = {
    applications: [],
    bctApplications: [],
    icebergApplications: [],
    cgsApplications: []
  }
  con.query(`SELECT * FROM applications ORDER BY createdAt DESC`).then(rows => {
    initialQueries.applications = rows;
    utils.logger.log({
      level: "info",
      message: "Applications Fetched",
      isLoggedIn: true,
      userID,
      accessToken,
      api
    })
    return con.query(`SELECT * FROM 17th_applications ORDER BY createdAt DESC`)
  }).then(rows => {
    utils.logger.log({
      level: "info",
      message: "17th Applications Fetched",
      isLoggedIn: true,
      userID,
      accessToken,
      api
    })
    rows.forEach(row => {
      row.division = "17th";
      initialQueries.bctApplications.push(row);
    })
    return con.query(`SELECT * FROM iceberg_applications ORDER BY createdAt DESC`)
  }).then(rows => {
    utils.logger.log({
      level: "info",
      message: "Iceberg Applications Fetched",
      isLoggedIn: true,
      userID,
      accessToken,
      api
    })
    rows.forEach(row => {
      row.division = "Iceberg";
      initialQueries.icebergApplications.push(row);
    })
    return con.query(`SELECT * FROM cgs_applications ORDER BY createdAt DESC`)
  }).then(rows => {
    utils.logger.log({
      level: "info",
      message: "CGS Applications Fetched",
      isLoggedIn: true,
      userID,
      accessToken,
      api
    })
    rows.forEach(row => {
      row.division = "CGS";
      initialQueries.cgsApplications.push(row);
    })
    res.json({
      applications: initialQueries.applications,
      bct_applications: initialQueries.bctApplications,
      iceberg_applications: initialQueries.icebergApplications,
      cgs_applications: initialQueries.cgsApplications
    })
    utils.logger.log({
      level: "info",
      message: "Applications Completed",
      isLoggedIn: true,
      userID,
      accessToken,
      api
    })
  }).catch(error => {
    if (error) {
      utils.logger.log({
        level: "error",
        message: error.message,
        stack: error.stack,
        isLoggedIn: true,
        userID,
        accessToken,
        api
      })
      res.sendStatus(500);
    }
  })
}
