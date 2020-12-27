const express = require('express')
const router = express.Router();
const port = 3000
const {jwt_secret, jwt_refresh_secret} = require("../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
const utils = require("../../utils.js");
const {requiresAuth} = require("../middleware/auth");
const {DateTime} = require("luxon");

router.use(requiresAuth);
const VALID_CHANGE_ROLES = { // Combined with canUserChangeRole17th, this is a "table" of what roles can
  BCT_NCO: ["[17th] Ranger", "[17th] 32nd LSG"],
  BCT_OFFICER: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO"],
  BCT_ALPHA_COMPANY_HQ: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer"],
  BCT_ICE_OWNER: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ"],
  CGS_OFFICER: ["[CGS] Member"],
  CGS_OWNER: ["[CGS] Owner"]
}

function canUserChangeRole17th(currentRoles, role) {
  let isValid = false;
  if (utils.doesUserContainRoles(currentRoles, ["[17th] NCO"]) && VALID_CHANGE_ROLES.BCT_NCO.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[17th] 1st Platoon HQ", "[17th] 32nd LSG HQ"]) && VALID_CHANGE_ROLES.BCT_OFFICER.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[17th] Alpha Company HQ"]) && VALID_CHANGE_ROLES.BCT_ALPHA_COMPANY_HQ.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[ICE] Owner", "[ICE] Admin"]) && VALID_CHANGE_ROLES.BCT_ICE_OWNER.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[ICE] Webmaster"])) isValid = true;
  return isValid
}

function canUserChangeRoleCGS(currentRoles, role) {
  let isValid = false;
  if (utils.doesUserContainRoles(currentRoles, ["[CGS] Officer"]) && VALID_CHANGE_ROLES.CGS_OFFICER.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[CGS] Owner"]) && VALID_CHANGE_ROLES.CGS_OWNER.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[ICE] Webmaster"])) isValid = true;
  return isValid
}

const displayed17thRoles = ["[17th] Member", "[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ"]; // Roles that are displayed to the admin when editing a user's roles
const displayedCGSRoles = ["[CGS] Owner", "[CGS Officer]", "[CGS] Member"]; // Roles that are displayed to the admin when editing a user's roles
const WHO_CAN_REMOVE_ICEBERG_USERS = ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"]; // Roles that can remove an iceberg user
const WHO_CAN_REMOVE_17th_USERS = ["[17th] Officer", "[17th] Alpha Company HQ", "[ICE] Owner", "[ICE] Webmaster", "[ICE] Admin"]; // Roles that can remove a 17th User


// POST: /api/v1/user-management/get-editable-roles
// Params: none
// Body: accessToken, userID, division
// Return: roles
router.post('/get-editable-roles', async (req, res) => {
  let {accessToken, userID, division} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/get-editable-roles"
  if (!accessToken || !userID || !division) return res.status(400).send("Bad Request! Please pass in an accessToken and a userID.");
  if(division.toLowerCase() !== "17th" && division.toLowerCase() !== "cgs") return res.sendStatus(400);
  const currentRoles = req.user.roles;
  let returnedRoles = [];
  con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]).then(rows => {
    let roles = [];
    rows.forEach(row => {
      roles.push(row.role);
    })
    if(division.toLowerCase() === "17th") {
      displayed17thRoles.forEach(role => {
        returnedRoles.push({
          role,
          doesUserHaveIt: utils.doesUserContainRoles(roles, role),
          isDisabled: !canUserChangeRole17th(currentRoles, role)
        })
      })
    } else if(division.toLowerCase() === "cgs") {
      displayedCGSRoles.forEach(role => {
        returnedRoles.push({
          role,
          doesUserHaveIt: utils.doesUserContainRoles(roles, role),
          isDisabled: !canUserChangeRole17th(currentRoles, role)
        })
      })
    }

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
})

// POST: /api/v1/user-management/change-roles
// Params: none
// Body: accessToken, role, newRoleStatus, id, userID
// Return: <status_code>
router.post('/change-roles', async (req, res) => {
  let {accessToken, roles, userID} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/change-roles"
  if (!accessToken || !roles || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken, roles, and a userID.");
  let currentRoles = req.user.roles;
  let wasReturned = false;
  con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]).then(rows => {
    let rolesTheUserHas = [];
    rows.forEach(row => {
      rolesTheUserHas.push(row.role);
    })
    roles.forEach(role => {
      if (canUserChangeRole17th(currentRoles, role.role) || canUserChangeRoleCGS(currentRoles, role.role)) {
        if (role.doesUserHaveIt) { // Meaning they either have it or want it
          if (!utils.doesUserContainRoles(rolesTheUserHas, [role.role])) {
            con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [userID, role.role]).then(() => {
              if (!wasReturned) {
                res.sendStatus(200);
                wasReturned = true;
              }
              utils.logger.log({
                level: "info",
                message: "Role Created",
                userID,
                role,
                roles: currentRoles,
                isLoggedIn: true,
                api,
                accessToken
              })
            }).catch(error => {
              if (error) {
                if (!wasReturned) {
                  res.sendStatus(500);
                  wasReturned = true;
                }
                utils.logger.log({
                  level: "error",
                  message: error.message,
                  stack: error.stack,
                  userID,
                  role,
                  roles: currentRoles,
                  isLoggedIn: true,
                  api,
                  accessToken
                })
              }
            })
          }
        } else if (!role.doesUserHaveIt) {
          con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [userID, role.role]).then(() => {
            if (!wasReturned) {
              res.sendStatus(200);
              wasReturned = true;
            }
            utils.logger.log({
              level: "info",
              message: "Role Deleted",
              userID,
              role,
              roles: currentRoles,
              isLoggedIn: true,
              api,
              accessToken
            })
          }).catch(error => {
            if (error) {
              if (!wasReturned) {
                res.sendStatus(500);
                wasReturned = true;
              }
              utils.logger.log({
                level: "error",
                message: error.message,
                stack: error.stack,
                userID,
                role,
                roles: currentRoles,
                isLoggedIn: true,
                api,
                accessToken
              })
            }
          })
        }
      } else {
        if (!wasReturned) {
          res.sendStatus(200);
          wasReturned = true;
        }
        utils.logger.log({
          level: "notice",
          message: "Attempt at removing roles without proper permissions",
          userID,
          role,
          roles: currentRoles,
          isLoggedIn: true,
          api,
          accessToken
        })
      }

    })
  }).catch(error => {
    if (error) {
      if (!wasReturned) {
        res.sendStatus(500);
        wasReturned = true;
      }
      utils.logger.log({
        level: "error",
        message: error.message,
        stack: error.stack,
        userID,
        roles: currentRoles,
        isLoggedIn: true,
        api,
        accessToken
      })
    }
  })
})

// POST: /api/v1/user-management/17th/remove-user
// Params: none
// Body: accessToken, userID
// Return: <status_code>
router.post('/17th/remove-user', async (req, res) => {
  let {accessToken, userID} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/17th/change-roles"
  if (!accessToken || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken and a userID.");
  let currentRoles = req.user.roles;

  if (utils.doesUserContainRoles(currentRoles, WHO_CAN_REMOVE_17th_USERS)) {
    con.query(`DELETE FROM 17th_members WHERE userID = ?`, [userID])
      .then(() => {
        return con.query(`DELETE FROM user_roles WHERE userID = ? AND role = ?`, [userID, "[17th] Member"])
      }).then(() => {
      utils.logger.log({
        level: "info",
        message: "17th Member Deleted",
        isLoggedIn: true,
        userID: req.user.id,
        removedUser: userID,
        accessToken,
        api
      })
      res.sendStatus(200);
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: req.user.id,
          removedUser: userID,
          accessToken,
          api
        })
        res.sendStatus(400);
      }
    })
  } else res.sendStatus(401);
})

// POST: /api/v1/user-management/iceberg/remove-user
// Params: none
// Body: accessToken, userID
// Return: <status_code>
router.post('/iceberg/remove-user', async (req, res) => {
  const {accessToken, userID} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/17th/change-roles"

  if (!accessToken || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken and a userID.");
  const currentRoles = req.user.roles;
  if (utils.doesUserContainRoles(currentRoles, WHO_CAN_REMOVE_ICEBERG_USERS)) {
    con.query(`DELETE FROM user_roles WHERE userID = ?`, [userID]).then(() => {
      utils.logger.log({
        level: "info",
        message: "Iceberg Member Deleted",
        isLoggedIn: true,
        userID: req.user.id,
        removedUser: userID,
        accessToken,
        api
      })
      return con.query(`INSERT INTO user_roles (userID, role) VALUES (?, ?)`, [userID, '[ICE] Applicant'])
    }).then(() => {
      res.sendStatus(200);
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: req.user.id,
          removedUser: userID,
          accessToken,
          api
        })
        res.sendStatus(400);
      }
    })
  } else res.sendStatus(401);
})

module.exports = {
  router
};
