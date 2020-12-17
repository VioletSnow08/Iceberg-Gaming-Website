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
  NCO: ["[17th] Ranger", "[17th] 32nd LSG"],
  OFFICER: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO"],
  ALPHA_COMPANY_HQ: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer"],
  ICE_OWNER: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ"]
}

function canUserChangeRole17th(currentRoles, role) {
  let isValid = false;
  if (utils.doesUserContainRoles(currentRoles, ["[17th] NCO"]) && VALID_CHANGE_ROLES.NCO.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[17th] 1st Platoon HQ", "[17th] 32nd LSG HQ"]) && VALID_CHANGE_ROLES.OFFICER.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[17th] Alpha Company HQ"]) && VALID_CHANGE_ROLES.ALPHA_COMPANY_HQ.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[ICE] Owner"]) && VALID_CHANGE_ROLES.ICE_OWNER.includes(role)) {
    isValid = true;
  }
  // if(utils.doesUserContainRoles(currentRoles, ["[ICE] Webmaster"])) isValid = true;
  return isValid
}

const displayed17thRoles = ["[17th] Member", "[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ"];


// POST: /api/v1/user-management/17th/get-roles
// Params: none
// Body: accessToken, userID
// Return: roles
router.post('/17th/get-roles', async (req, res) => {
  let {accessToken, userID} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/17th/change-roles"
  if (!accessToken || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken and a userID.");
  let currentRoles = req.user.roles;
  let returnedRoles = [];
  con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]).then(rows => {
    let roles = [];
    rows.forEach(row => {
      roles.push(row.role);
    })
    displayed17thRoles.forEach(role => {
        returnedRoles.push({
          role,
          doesUserHaveIt: utils.doesUserContainRoles(roles, role),
          isDisabled: !canUserChangeRole17th(currentRoles, role)
        })
    })
    res.json(returnedRoles);
  })
})

// POST: /api/v1/user-management/17th/change-roles
// Params: none
// Body: accessToken, role, newRoleStatus, id, userID
// Return: <status_code>
router.post('/17th/change-roles', async (req, res) => {
  let {accessToken, roles, userID} = req.body;
  const con = req.app.get('con');
  const api = "/api/v1/user-management/17th/change-roles"
  if (!accessToken || !roles || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken, roles, and a userID.");
  let currentRoles = req.user.roles;
  let wasReturned = false;
  con.query(`SELECT * FROM user_roles WHERE userID = ?`, [userID]).then(rows => {
    let rolesTheUserHas = [];
    rows.forEach(row => {
      rolesTheUserHas.push(row.role);
    })
    roles.forEach(role => {
      if (canUserChangeRole17th(currentRoles, role.role)) {
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

module.exports = {
  router
};
