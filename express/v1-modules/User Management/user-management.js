const express = require('express')
const router = express.Router();
const utils = require("../../../utils.js");
const {requiresAuth} = require("../../middleware/auth");
router.use(requiresAuth);

// !!!! PLEASE NOTE THAT WITH THIS SYSTEM ADMINS+ CANNOT BE REMOVED FROM A DIVISION FROM ANYONE BELOW THEM, REGARDLESS IF THEY ARE A LOWER RANKING MEMBER IN THAT DIVISION. THIS IS BECAUSE ADMINS ARE IN ALL DIVISIONS. !!!!

const memberRoles = {
  bct: "[17th] Member",
  iceberg: "[ICE] Member",
  cgs: "[CGS] Member"
}
const roles = [memberRoles.iceberg, "[ICE] Recruiter", "[ICE] Admin", "[ICE] Owner", "[ICE] Webmaster", memberRoles.bct, "[17th] Ranger",
  "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ", memberRoles.cgs, "[CGS] Officer", "[CGS] Owner",];

const VALID_CHANGE_ROLES = { // What roles each role can toggle
  BCT_NCO: ["[17th] Ranger", "[17th] 32nd LSG"],
  BCT_OFFICER: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO"],
  BCT_ALPHA_COMPANY_HQ: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer"],
  ICE_OWNER: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ", "[ICE] Admin", "[ICE] Recruiter"],
  ICE_ADMIN: ["[17th] Ranger", "[17th] 32nd LSG", "[17th] NCO", "[17th] Officer", "[17th] Alpha Company HQ", "[ICE] Recruiter"],
  CGS_OFFICER: [memberRoles.cgs],
  CGS_OWNER: ["[CGS] Owner"],
}
const INVALID_REMOVE_ROLES = { // What roles a certain role cannot remove if a user contains them
  ICE_OWNER: ["[ICE] Owner", "[ICE] Webmaster"],
  ICE_ADMIN: ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster"],
  BCT_ALPHA_COMPANY_HQ: ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster", "[17th] Alpha Company HQ"],
  BCT_OFFICER: ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster", "[17th] Alpha Company HQ", "[17th] Officer"],
  BCT_NCO: ["[ICE] Owner", "[ICE] Admin", "[ICE] Webmaster", "[17th] Alpha Company HQ", "[17th] Officer", "[17th] NCO"],
  CGS_OWNER: ["[CGS] Owner"],
  CGS_OFFICER: ["[CGS] Owner", "[CGS] Officer"],
}

const VALID_REMOVE_ROLES = { // What roles each role CAN remove. Example: ICE_OWNER can remove anyone with the [17th] Member, [ICE] Member, and [CGS] Member(division check in the function)
  ICE_OWNER: [memberRoles.bct, memberRoles.iceberg, memberRoles.cgs],
  ICE_ADMIN: [memberRoles.bct, memberRoles.iceberg, memberRoles.cgs],
  BCT_ALPHA_COMPANY_HQ: [memberRoles.bct],
  BCT_OFFICER: [memberRoles.bct],
  BCT_NCO: [memberRoles.bct],
  CGS_OWNER: [memberRoles.cgs],
  CGS_OFFICER: [memberRoles.cgs]
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
  if (utils.doesUserContainRoles(currentRoles, ["[CGS] Owner"]) && VALID_CHANGE_ROLES.CGS_OWNER.includes(role)) {
    isValid = true;
  }
  if (utils.doesUserContainRoles(currentRoles, ["[CGS] Officer"]) && VALID_CHANGE_ROLES.CGS_OFFICER.includes(role)) {
    isValid = true;
  }
//  Overrides
  if (utils.doesUserContainRoles(currentRoles, ["[ICE] Webmaster"])) isValid = true;
  return isValid;
}

// Params: currentRoles, division, rolesOfUserBeingRemoved
// currentRoles: roles of the admin
// division: division of the user being removed
// rolesOfUserBeingRemoved: the roles of the user being removed

function canUserRemoveUser(currentRoles, division, rolesOfUserBeingRemoved) { // Example: If the Admin's roles contains a VALID_REMOVE_ROLE but the user they are trying to remove contains an INVALID_REMOVE_ROLE, then return 401.
  division = division.toLowerCase();
  let isValid = false;
  if(division === "iceberg") { // If we are removing a user from Iceberg...
    if(utils.doesUserContainRoles(currentRoles, ["[ICE] Owner"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.ICE_OWNER) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.ICE_OWNER)) {
      isValid = true;
    }
    if(utils.doesUserContainRoles(currentRoles, ["[ICE] Admin"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.ICE_ADMIN) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.ICE_ADMIN)) {
      isValid = true;
    }
  } else if(division === "17th") {
    if(utils.doesUserContainRoles(currentRoles, ["[ICE] Owner"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.ICE_OWNER) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.ICE_OWNER)) {
      isValid = true;
    }
    if(utils.doesUserContainRoles(currentRoles, ["[ICE] Admin"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.ICE_ADMIN) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.ICE_ADMIN)) {
      isValid = true;
    }
    if(utils.doesUserContainRoles(currentRoles, ["[17th] Officer"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.BCT_OFFICER) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.BCT_OFFICER)) {
      isValid = true;
    }
    if(utils.doesUserContainRoles(currentRoles, ["[17th] Alpha Company HQ"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.BCT_ALPHA_COMPANY_HQ) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.BCT_ALPHA_COMPANY_HQ)) {
      isValid = true;
    }
  } else if(division === "cgs") {
    if(utils.doesUserContainRoles(currentRoles, ["[ICE] Owner"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.ICE_OWNER) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.ICE_OWNER)) {
      isValid = true;
    }
    if(utils.doesUserContainRoles(currentRoles, ["[ICE] Admin"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.ICE_ADMIN) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.ICE_ADMIN)) {
      isValid = true;
    }
    if(utils.doesUserContainRoles(currentRoles, ["[CGS] Owner"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.CGS_OWNER) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.CGS_OWNER)) {
      isValid = true;
    }
    if(utils.doesUserContainRoles(currentRoles, ["[CGS] Officer"]) && utils.doesUserContainRoles(rolesOfUserBeingRemoved, VALID_REMOVE_ROLES.CGS_OFFICER) && !utils.doesUserContainRoles(rolesOfUserBeingRemoved, INVALID_REMOVE_ROLES.CGS_OFFICER)) {
      isValid = true;
    }
  }
  if(utils.doesUserContainRoles(currentRoles, ["[ICE] Webmaster"])) {
    isValid = true;
  }

  return isValid;
}

// POST: /api/v1/user-management/get-editable-roles
// Params: none
// Body: accessToken, userID
// Return: roles
router.post('/get-editable-roles', async (req, res) => {
  require("./get-edtitable-roles").index(req, res, roles, canUserChangeRole);
})

// POST: /api/v1/user-management/get-removable-divisions
// Params: none
// Body: accessToken
// Return: removableDivisions
router.post('/get-removable-divisions', async (req, res) => {
  require("./get-removable-divisions").index(req, res, canUserRemoveUser)
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
  require("./remove-user").index(req, res, VALID_REMOVE_ROLES, canUserRemoveUser);
})

module.exports = {
  router
};
