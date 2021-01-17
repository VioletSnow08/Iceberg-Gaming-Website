const express = require('express')
const router = express.Router();
const utils = require("../../../utils.js");
const config = require("../../../config");
const {requiresAuth} = require("../../middleware/auth");
router.use(requiresAuth);

// !!!! PLEASE NOTE THAT WITH THIS SYSTEM ADMINS+ CANNOT BE REMOVED FROM A DIVISION FROM ANYONE BELOW THEM, REGARDLESS IF THEY ARE A LOWER RANKING MEMBER IN THAT DIVISION. THIS IS BECAUSE ADMINS ARE IN ALL DIVISIONS. !!!!

const memberRoles = config.memberRoles;
const roles = config.rolesArray;

const VALID_CHANGE_ROLES = config.VALID_CHANGE_ROLES;
const INVALID_REMOVE_ROLES = config.INVALID_REMOVE_ROLES;

const VALID_REMOVE_ROLES = config.VALID_REMOVE_ROLES;

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
