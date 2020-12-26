const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../utils.js");
const {DateTime} = require("luxon");
const {requiresAuth} = require("../middleware/auth");
const fileUpload = require('express-fileupload');
const CHANNEL_EDIT_ROLES = {
  bct: ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster', '[17th] Alpha Company HQ', '[17th] Officer'],
  iceberg: ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster'],
  cgs: ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster', '[CGS] Owner']
}
const CDN_DIRECTORY = __dirname + '/../documents';

router.use(fileUpload());
router.use(requiresAuth);

// ---------- CHANNELS -----------

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
  let iq = { // IQ = Initial Queries
    channels: [], // I mean...
    events: [], // Ok, really dude?
    attendance: [], // Attendance for each event
    topics: [], // Basically posts,
    replies: [], // Basically comments or responses,
    documents: [] // PDFs
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
    return con.query(`SELECT * FROM channels_documents_pdfs`)
  }).then(rows => {
    rows.forEach(row => {
      iq.documents.push(row);
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
      } else if (channel.type.toLowerCase() === "documents") {
        let newChannel = {
          ...channel,
          documents: []
        }
        iq.documents.forEach(document => {
          if(channel.id === document.channelID) {
            newChannel.documents.push(document);
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
  let oldDivision = division;
  division = division.toLowerCase();
  type = type.toLowerCase();
  if (division !== "17th" && division !== "cgs" && division !== "iceberg") return res.sendStatus(400);
  if (type !== "calendar" && type !== "forum" && type !== "documents") return res.sendStatus(400);

  if ((division === "iceberg" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.iceberg)) || (division === "17th" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.bct)) || (division === "cgs" && utils.doesUserContainRoles(req.user.roles, CHANNEL_EDIT_ROLES.cgs))) {
    con.query(`INSERT INTO channels (name, division, type) VALUES (?, ?, ?)`, [name, oldDivision, type]).then(() => {
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
          oldDivision,
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

// ---------- EVENTS -----------

// POST: /api/v1/channels/calendar/event/create
// Params: none
// Body: accessToken, startDateTime, endDateTime, color, title, channelID
// Return: <status_code>
router.post('/calendar/event/create', async (req, res) => {
  let {accessToken, startDateTime, endDateTime, color, title, channelID, description} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/calendar/event/create";
  if (!description) description = "<p>No Description</p>"
  if (!accessToken || !startDateTime || !endDateTime || !color || !title || !channelID || !description) return res.status(400).send("Bad Request! Please pass in an accessToken, startDateTime, endDateTime, color, description, channelID, and title!");

  const createdAt = utils.getCurrentDateISO();
  const start = DateTime.fromISO(startDateTime).setZone('America/Chicago').toISO();
  const end = DateTime.fromISO(endDateTime).setZone('America/Chicago').toISO();

  let isChannelValid = false;
  con.query(`SELECT * FROM channels WHERE id = ? AND type = ?`, [channelID, 'calendar']).then(rows => {
    utils.logger.log({
      level: "info",
      message: "Fetched Channel",
      type: 'calendar',
      userID,
      api,
      isLoggedIn: true,
      channelID
    })
    if (rows) {
      isChannelValid = true;
      return con.query(`INSERT INTO channels_calendar_events (start, end, color, title, createdAt, channelID, userID, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [start, end, color, title, createdAt, channelID, userID, description])
    } else res.sendStatus(400);
  }).then(() => {
    if (!res.headersSent) { // Meaning no errors have occurred
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "Created Event",
        type: 'calendar',
        userID,
        api,
        isLoggedIn: true,
        title,
        channelID
      })
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
      accessToken,
      description
    })
  })
})

// POST: /api/v1/channels/calendar/event/edit
// Params: none
// Body: accessToken, channelID
// Return: <status_code>
router.post('/calendar/event/edit', async (req, res) => {
  let {accessToken, startDateTime, endDateTime, color, title, channelID, description, eventID} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/calendar/event/edit";
  if (!accessToken || !startDateTime || !endDateTime || !color || !title || !channelID || !description) return res.status(400).send("Bad Request! Please pass in an accessToken, startDateTime, endDateTime, color, description, eventID, channelID, and title!");

  const start = DateTime.fromISO(startDateTime).setZone('America/Chicago').toISO();
  const end = DateTime.fromISO(endDateTime).setZone('America/Chicago').toISO();

  con.query(`UPDATE channels_calendar_events SET start = ?, end = ?, color = ?, title = ?, description = ? WHERE userID = ? AND id = ? AND channelID = ?`, [start, end, color, title, description, userID, eventID, channelID]).then(() => {
    utils.logger.log({
      level: "info",
      message: "Edited Event",
      type: 'calendar',
      userID,
      api,
      isLoggedIn: true,
      eventID,
      channelID
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
        api,
        channelID,
        eventID,
        accessToken
      })
    }
  })
})

// POST: /api/v1/channels/calendar/event/delete
// Params: none
// Body: accessToken, startDateTime, endDateTime, color, title, channelID
// Return: <status_code>
router.post('/calendar/event/delete', async (req, res) => {
  let {accessToken, channelID, eventID} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/calendar/event/delete";
  if (!accessToken || !eventID || !channelID) return res.status(400).send("Bad Request! Please pass in an accessToken, channelID, and an eventID!");

  con.query(`DELETE FROM channels_calendar_events WHERE userID = ? AND id = ? AND channelID = ?`, [userID, eventID, channelID]).then(() => {
    utils.logger.log({
      level: "info",
      message: "Deleted Event",
      type: 'calendar',
      userID,
      api,
      isLoggedIn: true,
      eventID,
      channelID
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
        api,
        channelID,
        eventID,
        accessToken
      })
    }
  })
})


// POST: /api/v1/channels/calendar/event/set-attendance
// Params: none
// Body: accessToken, eventID, channelID, status, userID
// Return: <status_code>
router.post('/calendar/event/set-attendance', async (req, res) => {
  let {accessToken, channelID, eventID, status, userID} = req.body;
  const loggedInUserID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/calendar/event/set-attendance";
  if (!accessToken || !eventID || !channelID || !status || !userID) return res.status(400).send("Bad Request! Please pass in an accessToken, channelID, userID, status, and an eventID!");
  if (status !== "Going" && status !== "Maybe" && status !== "Declined") return res.sendStatus(400); // Makes sure that the statuses are correct
  con.query(`SELECT * FROM channels_calendar_attendance WHERE userID = ? AND eventID = ? AND channelID = ?`, [userID, eventID, channelID]).then(rows => { // Checks if user has any attendance for this current event already set
    if (rows) {
      return con.query(`DELETE FROM channels_calendar_attendance WHERE userID = ? AND eventID = ? AND channelID = ?`, [userID, eventID, channelID]) // If so, then remove it
    }
  }).then(() => {
    utils.logger.log({
      level: "info",
      message: "Deleted Attendance",
      userID,
      accessToken,
      eventID,
      channelID,
      status,
      api,
      loggedInUserID
    })
    return con.query(`INSERT INTO channels_calendar_attendance (userID, eventID, channelID, status) VALUES (?, ?, ?, ?)`, [userID, eventID, channelID, status]) // Then either way, insert their new attendance
  }).then(() => {
    utils.logger.log({
      level: "info",
      message: "Set Attendance",
      type: 'calendar',
      userID,
      api,
      isLoggedIn: true,
      eventID,
      channelID,
      loggedInUserID
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
        api,
        channelID,
        eventID,
        accessToken,
        loggedInUserID
      })
    }
  })
})

// ---------- DOCUMENTS -----------

// POST: /api/v1/channels/documents/create
// Params: none
// Body: accessToken, formData
// Return: <status_code>
router.post('/documents/create', async (req, res) => {
  let {accessToken, name, channelID} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/documents/create";
  if (!name || !channelID) return res.sendStatus(400);
  if (!req.files) {
    return res.status(500).send({msg: "File Not Found!"})
  }

  const file = req.files.file;
  if(!file.name.toLowerCase().endsWith('.pdf')) return res.sendStatus(400);
  con.query(`SELECT * FROM channels_documents_pdfs WHERE filename = ?`, [file.name]).then(rows => {
    if (rows[0]) {
      res.sendStatus(400);
    } else {
      return file.mv(`${CDN_DIRECTORY}/${file.name}`)
    }
  }).then(() => {
    if (!res.headersSent) {
      return con.query(`INSERT INTO channels_documents_pdfs (userID, filename, name, channelID) VALUES (?, ?, ?, ?)`, [userID, file.name, name, channelID])
    }
  }).then(() => {
    if (!res.headersSent) {
      res.sendStatus(200);
      utils.logger.log({
        level: "info",
        message: "Document Uploaded",
        api,
        userID,
        accessToken,
        name,
        filename: file.name,
        isLoggedIn: true,
        channelID
      })
    }
  }).catch(error => {
    if (error) {
      if (!res.headersSent) res.sendStatus(500);
      utils.logger.log({
        level: "info",
        message: error.message,
        stack: error.stack,
        api,
        userID,
        accessToken,
        name,
        filename: file.name,
        isLoggedIn: true,
        channelID
      })
    }
  })

})

// POST: /api/v1/channels/document
// Params: none
// Body: accessToken, channelID, documentID, filename
// Return: <status_code>
router.post('/document', async (req, res) => {
  let {accessToken, channelID, documentID, filename} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/document";
  if(!channelID || !documentID || !filename) return res.sendStatus(400);

  const fs = require("fs");
  const path = require("path");
  if(fs.existsSync(`${CDN_DIRECTORY}/${filename}`)) {
    res.sendFile(path.resolve(`${CDN_DIRECTORY}/${filename}`));
  } else {
    res.sendStatus(400);
  }
})


// POST: /api/v1/channels/documents/edit
// Params: none
// Body: accessToken, channelID, documentID, filename, name
// Return: <status_code>
router.post('/documents/edit', async (req, res) => {
  let {accessToken, channelID, documentID, filename, name} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/documents/edit";
  if (!channelID || !documentID || !filename || !name) return res.sendStatus(400);

  con.query(`SELECT * FROM channels_documents_pdfs WHERE userID = ? AND id = ? AND channelID = ? AND filename = ?`, [userID, documentID, channelID, filename]).then(rows => {
    if(rows) {
      return con.query(`UPDATE channels_documents_pdfs SET name = ? WHERE userID = ? AND id = ? AND channelID = ? AND filename = ?`, [name, userID, documentID, channelID, filename])
    } else {
      res.sendStatus(400);
    }
  }).then(() => {
    if(!res.headersSent) {
      res.sendStatus(200);
    }
    utils.logger.log({
      level: "info",
      message: "Edited Document",
      name,
      channelID,
      userID,
      documentID,
      filename,
      api,
      isLoggedIn: true
    })
  }).catch(error => {
    if(error) {
      res.sendStatus(400);
    }
    utils.logger.log({
      level: "error",
      message: error.message,
      stack: error.stack,
      name,
      channelID,
      userID,
      documentID,
      filename,
      api,
      isLoggedIn: true
    })
  })
})

// POST: /api/v1/channels/documents/delete
// Params: none
// Body: accessToken, channelID, documentID, filename
// Return: <status_code>
router.post('/documents/delete', async (req, res) => {
  let {accessToken, channelID, documentID, filename} = req.body;
  const userID = req.user.id;
  const con = req.app.get('con');
  const api = "/api/v1/channels/documents/delete";
  if (!channelID || !documentID || !filename) return res.sendStatus(400);

  con.query(`SELECT * FROM channels_documents_pdfs WHERE userID = ? AND id = ? AND channelID = ? AND filename = ?`, [userID, documentID, channelID, filename]).then(rows => {
    if(rows) {
      return con.query(`DELETE FROM channels_documents_pdfs WHERE userID = ? AND id = ? AND channelID = ? AND filename = ?`, [userID, documentID, channelID, filename])
    } else {
      res.sendStatus(400);
    }
  }).then(() => {
    if(!res.headersSent) {
      res.sendStatus(200);
    }
    utils.logger.log({
      level: "info",
      message: "Deleted Document",
      channelID,
      userID,
      documentID,
      filename,
      api,
      isLoggedIn: true
    })
  }).catch(error => {
    if(error) {
      res.sendStatus(400);
    }
    utils.logger.log({
      level: "error",
      message: error.message,
      stack: error.stack,
      channelID,
      userID,
      documentID,
      filename,
      api,
      isLoggedIn: true
    })
  })
})
module.exports = {
  router
};
