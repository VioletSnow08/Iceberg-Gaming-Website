const axios = require("axios");
const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../../utils.js");
const config = require("../../../config");
const {DateTime} = require("luxon");
const {requiresAuth} = require("../../middleware/auth");

router.use(requiresAuth);

// POST: /api/v1/applications
// Params: none
// Body: accessToken
// Return: loa
router.post('/', async (req, res) => {
  require("./index").index(req, res);
})

// POST: /api/v1/applications/create/<division>
// Params: division
// Body: accessToken, questions
// Return: application
router.post('/create/:division', async (req, res) => {
  require("./create").index(req, res);
})

// POST: /api/v1/applications/<action>/<id>
// Params: action, id, division
// Body: accessToken
// Return: application

router.delete('/change/', async (req, res) => {
  require("./change").index(req, res, bctMessageApprove, bctMessageDeny, bctMessageProcess, icebergMessageApprove, icebergMessageProcess, icebergMessageDeny, cgsMessageApprove, cgsMessageProcess, cgsMessageDeny);
})

module.exports = {
  router
};


function bctMessageApprove(req) {
  return "Hello,\n" +
    "\n" +
    "Your application to the 17th Brigade Combat Team has been accepted! It is our great pleasure to welcome you to the community. \n" +
    "\n" +
    "There are only a couple of things to take care of in order to join us on the battlefield: \n" +
    "\n" +
    "First, you need to obtain the modpack that we use on our private server. It can take a little while to download everything, so try to get it started as soon as possible. The following link will take you to our \"shadow mod\" which acts as a dependency node for all of the mods we use. In order to get the mod pack, simply subscribe to the Shadow Mod, and when it asks if you want to download all mods associated, say yes.\n" +
    "\n" +
    `${config.commonData.bct_modpack}\n` +
    "\n" +
    "Second, once you have your modpack, look for anybody that is Corporal or above on TeamSpeak or make a post on the Discord and someone will get you set up. \n" +
    "\n" +
    `TS: ${config.commonData.teamspeak}\n` +
    `Discord: ${config.commonData.discord}\n` +
    "\n" +
    "They will be able to help you or find someone to help you with initial assessments and/or training. Basic Training is held weekly on Tuesdays, but don't let that stop you from jumping in during the week and Saturday op to play with us!\n" +
    "\n" +
    "Finally, please take the time to familiarize yourself with our Code of Conduct, Ranks, and Structure misc. You might also take the time to browse our forums and introduce yourself.\n" +
    "\n" +
    "If you have any further questions or issues, you are more than welcome to ask anyone on Teamspeak, Discord, or even Enjin and we will help out as best as we can!\n" +
    "\n" +
    "Regards,\n" +
    "\n" +
    `${req.user.username}`
}

function bctMessageDeny(req) {
  return "Hello,\n" +
    "We have reviewed your application and we thank you for your interest in joining the 17th Brigade Combat Team. However, we are regrettably unable to accept your application at this time. Please feel free to inquire why your application was not approved. You are free to resubmit your application in the future when we may be better able to incorporate you.\n" +
    "\n" +
    "All the best.\n" +
    "\n" +
    "-Staff\n";
}

function bctMessageProcess(req) {
  return "Hello,\n" +
    "\n" +
    `Your application has been processed and the recruiter has requested an interview. When you're able to, hop on to the TeamSpeak (${config.commonData.teamspeak}) and reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here.\n` +
    "\n" +
    "Thanks,\n" +
    "\n" +
    `${req.user.username}`
}

function icebergMessageApprove(req) {
  return "Welcome to Iceberg Gaming! We're glad to have you aboard our community and hope you can feel at home in our community. \n" +
    "\n" +
    `If you haven't already, we highly recommend you join our Teamspeak (${config.commonData.teamspeak}) and Discord (${config.commonData.discord}) so you can play with the rest of the community. Feel free to chat in any of the channels with all the members of the community, and don't be afraid to explore some of the other games that we play in Iceberg Gaming. Keep yourself updated on the Website Calendar for any Iceberg events and don't be afraid to gather some people and schedule something of your own.\n` +
    "\n" +
    "Lastly, be sure to read up on the Community Code of Conduct so you make sure you can continue to have a good time in the community.\n" +
    "If you have any further questions or issues, you are more than welcome to ask anyone on Teamspeak, Discord, or even Website and we will help out as best as we can!\n" +
    "Regards, \n" + req.user.username;
}

function icebergMessageProcess(req) {
  return "Hello,\n" +
    "\n" +
    `Your application has been processed and the recruiter has requested an interview. When you're able to, hop on to the TeamSpeak (${config.commonData.teamspeak}) and reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here.\n` +
    "\n" +
    "Thanks,\n" +
    "\n" +
    `${req.user.username}`;
}

function icebergMessageDeny(req) {
  return "We have reviewed your application and we thank you for your interest in joining Iceberg Gaming. However, we are regrettably unable to accept your application at this time. Please feel free to inquire why your application was not approved. You are free to resubmit your application in the future when we may be better able to incorporate you.\n" +
    "All the best.\n" +
    "-Staff";
}

function cgsMessageApprove(req) {
  return "Wecome to Chryse Guard Security! We're glad to have you aboard our squadron." // TODO: FILL THIS OUT...
}
function cgsMessageProcess(req) {
  return "Hello,\n" +
    "\n" +
    `Your application has been processed and the recruiter has requested an interview. When you're able to, hop on to the TeamSpeak (${config.commonData.teamspeak}) and reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here.\n` +
    "\n" +
    "Thanks,\n" +
    "\n" +
    `${req.user.username}`;
}

function cgsMessageDeny(req) {
  return "We have reviewed your application and we thank you for your interest in joining Iceberg Gaming. However, we are regrettably unable to accept your application at this time. Please feel free to inquire why your application was not approved. You are free to resubmit your application in the future when we may be better able to incorporate you.\n" +
    "All the best.\n" +
    "-Staff";
}

