const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../utils.js");
const {DateTime} = require("luxon");
const {requiresAuth} = require("../middleware/auth");
const CHANNEL_EDIT_ROLES = {
  bct: ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster', '[17th] Alpha Company HQ', '[17th] Officer'],
  iceberg: ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster'],
  cgs: ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster', '[CGS] Owner']
}


router.use(requiresAuth);


// POST: /api/v1/channels
// Params: none
// Body: accessToken
// Return: channels
router.post('/', async (req, res) => {
  let {accessToken} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels";
  if (!accessToken) return res.status(400).send("Bad Request! Please pass in an accessToken!")
  let iq = {
    channels: [],
    events: [],
    attendance: [],
    topics: [], // Basically posts,
    replies: [] // Basically comments or responses
  }
  con.query(`SELECT * FROM channels`).then(rows => {
    rows.forEach(row => {
      iq.channels.push(row);
    })
    return con.query(`SELECT * FROM channels_calendar_events`)
  }).then(rows => {
    rows.forEach(row => {
      iq.events.push(row);
    })
    return con.query(`SELECT * FROM channels_calendar_attendance`)
  }).then(rows => {
    rows.forEach(row => {
      iq.attendance.push(row);
    })
    return con.query(`SELECT * FROM channels_forums_topics`)
  }).then(rows => {
    rows.forEach(row => {
      iq.topics.push(row);
    })
    return con.query(`SELECT * FROM channels_forums_replies`)
  }).then(rows => {
    rows.forEach(row => {
      iq.replies.push(row);
    })
    let channels = []
    iq.channels.forEach(channel => {
      if (channel.type.toLowerCase() === "calendar") {
        let newChannel = {
          ...channel,
          events: []
        }
        iq.events.forEach(event => {
          let newEvent = {
            ...event,
            attendance: []
          }
          if (event.channelID === channel.id) {
            iq.attendance.forEach(attendee => { // For Each attendee, check if the events are the same. If so, add them to the event's attendance array.
              if (attendee.eventID === event.id && attendee.channelID === channel.id) {
                newEvent.attendance.push(attendee);
              }
            })
            newChannel.events.push(newEvent); // Add the event to the channel's events array
          }
        })
        channels.push(newChannel);
      } else if (channel.type.toLowerCase() === "forum") {
        let newChannel = {
          ...channel,
          topics: [],
          replies: []
        }
        iq.topics.forEach(topic => {
          let newTopic = {
            ...topic,
            replies: []
          }
          if (topic.channelID === channel.id) {
            iq.replies.forEach(reply => {
              if (reply.topicID === topic.id && reply.channelID === channel.id) {
                newTopic.replies.push(reply);
              }
            })
            newChannel.topics.push(newTopic);
          }
        })
        channels.push(newChannel);
      }
    })
    res.json(channels);
  }).catch(error => {
    if (error) {
      res.sendStatus(500);
      utils.logger.log({
        level: "error",
        message: error.message,
        stack: error.stack,
        isLoggedIn: true,
        userID,
        accessToken,
        api
      })
    }
  })
})

// POST: /api/v1/channels/create
// Params: none
// Body: accessToken, division, name, type
// Return: <status_code>
router.post('/create', async (req, res) => {
  let {accessToken, division, name, type} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/create";
  if (!accessToken || !division || !name || !type) return res.status(400).send("Bad Request! Please pass in an accessToken, division, name, and type!")
  division = division.toLowerCase();
  type = type.toLowerCase();
  if (division !== "17th" && division !== "cgs" && division !== "iceberg") return res.sendStatus(400);
  if (type !== "calendar" && type !== "forum") return res.sendStatus(400);

  if ((division === "iceberg" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.iceberg)) || (division === "17th" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.bct)) || (division === "cgs" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.cgs))) {
    con.query(`INSERT INTO channels (name, division, type) VALUES (?, ?, ?)`, [name, division, type]).then(() => {
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
          api,
          division,
          type,
          name
        })
      }
    })
  } else return res.sendStatus(401);
})


// POST: /api/v1/channels/edit
// Params: none
// Body: accessToken, name, id
// Return: <status_code>
router.post('/edit', async (req, res) => {
  let {accessToken, name, id} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/edit";
  if (!accessToken || !name || !id) return res.status(400).send("Bad Request! Please pass in an accessToken, name, and id!");

  con.query(`SELECT * FROM channels WHERE id = ?`, [id]).then(rows => {
    if (rows) {
      let division = rows[0].division;
      if ((division === "iceberg" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.iceberg)) || (division === "17th" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.bct)) || (division === "cgs" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.cgs))) {
        con.query(`UPDATE channels SET name = ? WHERE id = ?`, [name, id]).then(() => {
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
              api,
              name
            })
          }
        })
      } else return res.sendStatus(401);
    } else return res.sendStatus(400) // Meaning invalid channel
  })
})


// POST: /api/v1/channels/delete
// Params: none
// Body: accessToken, id
// Return: <status_code>
router.post('/delete', async (req, res) => {
  let {accessToken, id} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/delete";
  if (!accessToken || !id) return res.status(400).send("Bad Request! Please pass in an accessToken and an id!");

  con.query(`SELECT * FROM channels WHERE id = ?`, [id]).then(rows => {
    if (rows) {
      let division = rows[0].division;
      if ((division === "iceberg" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.iceberg)) || (division === "17th" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.bct)) || (division === "cgs" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.cgs))) {
        con.query(`DELETE FROM  channels WHERE id = ?`, [id]).then(() => {
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
              api,
              name
            })
          }
        })
      } else return res.sendStatus(401);
    } else return res.sendStatus(400) // Meaning invalid channel
  })
})




// POST: /api/v1/channels/calendar/event/create
// Params: none
// Body: accessToken, startDateTime, endDateTime, color, title, channelID
// Return: <status_code>
router.post('/calendar/event/create', async (req, res) => {
  let {accessToken, startDateTime, endDateTime, color, title, channelID} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/calendar/event/create";
  if (!accessToken || !startDateTime || !endDateTime || !color || !title || !channelID) return res.status(400).send("Bad Request! Please pass in an accessToken, startDateTime, endDateTime, color, channelID, and title!");

  const createdAt = utils.getCurrentDateISO();
  const start = DateTime.fromISO(startDateTime).setZone('America/Chicago').toISO();
  const end = DateTime.fromISO(endDateTime).setZone('America/Chicago').toISO();

  let isChannelValid = false;
  con.query(`SELECT * FROM channels WHERE id = ? AND type = ?`, [channelID, 'calendar']).then(rows => {
    if (rows) {
      isChannelValid = true;
      return con.query(`INSERT INTO channels_calendar_events (start, end, color, title, createdAt, channelID, userID) VALUES (?, ?, ?, ?, ?, ?, ?)`, [start, end, color, title, createdAt, userID])
    } else res.sendStatus(400);
  }).then(() => {
    if (!res.headersSent) { // Meaning no errors have occurred
      res.sendStatus(200);
    }
  }).catch(error => {
    if (!res.headersSent) {
      res.sendStatus(500);
    }
    utils.logger.log({
      level: "error",
      message: error.message,
      stack: error.stack,
      isLoggedIn: true,
      userID,
      api,
      start,
      end,
      channelID,
      color,
      accessToken
    })
  })

})

module.exports = {
  router
};
