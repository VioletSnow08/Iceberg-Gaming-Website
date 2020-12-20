const express = require('express')
const router = express.Router();
const base_api = "/api/v1";
const utils = require("../../utils.js");
const {DateTime} = require("luxon");
const {requiresAuth} = require("../middleware/auth");

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
              if(reply.topicID === topic.id && reply.channelID === channel.id) {
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


module.exports = {
  router
};