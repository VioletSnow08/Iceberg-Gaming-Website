const express = require('express')
const router = express.Router();
const port = 3000
const {jwt_secret, jwt_refresh_secret} = require("../../../credentials");
const base_api = "/api/v1";
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const chalk = require('chalk');
const utils = require("../../../utils.js");
const {requiresAuth} = require("../../middleware/auth");
const {DateTime} = require("luxon");
router.use(requiresAuth);
const displayedEditableRoles = ["[ICE] Member", "[ICE] Recruiter", "[ICE] Admin", "[ICE] Owner", "[ICE] Webmaster", "[CGS] Member", "[CGS] Officer", "[CGS] Owner", "[17th] Member", "[17th] Ranger",
  "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ"];

const VALID_CHANGE_ROLES = { // Combined with canUserChangeRoles, this is a "table" of what roles can
  BCT_NCO: ["[17th] Ranger", "[17th] 32nd LSG"],
  BCT_OFFICER: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO"],
  BCT_ALPHA_COMPANY_HQ: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer"],
  ICE_OWNER: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ", "[ICE] Admin", "[ICE] Recruiter"],
  ICE_ADMIN: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ", "[ICE] Recruiter"],
  CGS_OFFICER: ["[CGS] Member"],
  CGS_OWNER: ["[CGS] Owner"],
}
const INVALID_REMOVE_ROLES = { // Combined with canUserRemoveUser, this is a "table" of what roles CAN'T(these are the people a role CAN'T REMOVE)
  BCT_NCO: ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster", "[17th] Alpha Company HQ", "[17th] Officer", "[17th] NCO"],
  BCT_OFFICER: ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster", "[17th] Alpha Company HQ", "[17th] Officer"],
  BCT_ALPHA_COMPANY_HQ: ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster", "[17th] Alpha Company HQ"],
  ICE_OWNER: ["[ICE] Owner", "[ICE] Webmaster"],
  ICE_ADMIN: ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"],
  CGS_OFFICER: ["[CGS] Owner", "[CGS] Officer"],
  CGS_OWNER: ["[CGS] Owner"],
}

const VALID_REMOVE_ROLES = {
  ICEBERG: ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"],
  BCT: ["[17th] Officer", "[17th] Alpha Company HQ", "[ICE] Owner", "[ICE] Webmaster", "[ICE] Admin"],
  CGS: ["[CGS] Owner", "[CGS] Officer", "[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"]
}

function canUserChangeRole(currentRoles, role) {
  let isValid = false;
  // Iceberg
  if (utils.doesUserContainRoles(currentRoles, ["[ICE] Owner"]) && VALID_CHANGE_ROLES.ICE_OWNER.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[ICE] Admin"]) && VALID_CHANGE_ROLES.ICE_ADMIN.includes(role)) {
    isValid = true;
  }
  // 17th BCT
  if (utils.doesUserContainRoles(currentRoles, ["[17th] NCO"]) && VALID_CHANGE_ROLES.BCT_NCO.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[17th] 1st Platoon HQ", "[17th] 32nd LSG HQ"]) && VALID_CHANGE_ROLES.BCT_OFFICER.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[17th] Alpha Company HQ"]) && VALID_CHANGE_ROLES.BCT_ALPHA_COMPANY_HQ.includes(role)) {
    isValid = true;
  }
//  CGS
  if (utils.doesUserContainRoles(currentRoles, ["[CGS] Officer"]) && VALID_CHANGE_ROLES.CGS_OFFICER.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[CGS] Owner"]) && VALID_CHANGE_ROLES.CGS_OWNER.includes(role)) {
    isValid = true;
  }
//  Overrides
  if (utils.doesUserContainRoles(currentRoles, ["[ICE] Webmaster"])) isValid = true;
  return isValid;
}

function canUserRemoveRole(currentRoles, role, rolesOfUserBeingRemoved) {

}

// POST: /api/v1/user-management/get-editable-roles
// Params: none
// Body: accessToken, userID
// Return: roles
router.post('/get-editable-roles', async (req, res) => {
  require("./get-edtitable-roles").index(req, res, displayedEditableRoles, canUserChangeRole);
})

// POST: /api/v1/user-management/get-removable-divisions
// Params: none
// Body: accessToken
// Return: removableDivisions
router.post('/get-removable-divisions', async (req, res) => {
  require("./get-removable-divisions").index(req, res, VALID_REMOVE_ROLES)
})

// POST: /api/v1/user-management/change-roles
// Params: none
// Body: accessToken, role, newRoleStatus, id, userID
// Return: <status_code>
// role: {role: '[ICE] Member', doesUserHaveIt: true, isDisabled: true}
router.post('/change-roles', async (req, res) => {
  require("./change-roles").index(req, res, canUserChangeRole);
})

// POST: /api/v1/user-management/remove-user
// Params: none
// Body: accessToken, userID, division
// Return: <status_code>
router.post('/remove-user', async (req, res) => {
  require("./remove-user").index(req, res, VALID_REMOVE_ROLES);
})

module.exports = {
  router
};
