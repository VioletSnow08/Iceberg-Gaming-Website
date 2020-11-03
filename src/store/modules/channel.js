import * as firebase from "firebase";
import {logger, alertWarn} from "@/utils";

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

const state = {
  channels: null
}
const getters = {
  channels: (state) => {
    return state.channels;
  },
  channel: (state) => (channelID) => {
    return state.channels.find(channel => channel.id === channelID);
  },
  events: (state) => (channelID) => {
    return state.channels.find(channel => channel.id === channelID).events;
  },
  event: (state) => (channelID, eventID) => {
    return state.channels.find(channel => channel.id === channelID).events.find(event => event.id === eventID);
  },
  threads: (state) => (channelID) => {
    return state.channels.find(channelID).threads;
  },
  thread: (state) => (channelID, threadID) => {
    return state.channels.find(channel => channel.id === channelID).threads.find(thread => thread.id === threadID);
  }
}
const actions = {
  async fetchChannels({commit}) {
    if (firebase.auth().currentUser) {
      let newChannels = [];
      let newEvents = [];
      let newThreads = [];
      await firebase.firestore().collection("channels").get().then(async channels => {
        await firebase.firestore().collectionGroup("events").get().then(async events => {
          events.forEach(event => {
            newEvents.push({
              id: event.id,
              ...event.data()
            })
          })
        }).catch(error => {
          if (error) {
            logger.log({
              level: "alert",
              message: error.message,
              stack: error.stack,
              userID: firebase.auth().currentUser.uid,
              isLoggedIn: true
            })
            alertWarn(0);
          }
        })
        await firebase.firestore().collectionGroup("threads").get().then(async threads => {
          threads.forEach(thread => {
            newThreads.push({
              id: thread.id,
              ...thread.data()
            })
          })
        }).catch(error => {
          if (error) {
            logger.log({
              level: "alert",
              message: error.message,
              stack: error.stack,
              userID: firebase.auth().currentUser.uid,
              isLoggedIn: true
            })
            alertWarn(0);
          }
        })
        channels.forEach(channel => {
          let newChannel = {
            id: channel.id,
            ...channel.data(),
          }
          if (newChannel.isCalendar) {
            newChannel = {
              ...newChannel,
              events: []
            }
            newEvents.forEach(event => {
              if (channel.id === event.channelID) { // For each event, check if the ID of the channel is === to the ID of the event. If so, then add that event to the events array
                newChannel.events.push(event);
              }
            });
          } else if (newChannel.isForum) {
            newChannel = {
              ...newChannel,
              threads: []
            }
            newThreads.forEach(thread => {
              if (channel.id === thread.channelID) { // For each thread, check if the ID of the channel is === to the ID of the thread. If so, then add that thread to the threads array.
                newChannel.threads.push(thread);
              }
            })
          }
          newChannels.push(newChannel);
        })
      }).catch(error => {
        if (error) {
          console.log(error);
          logger.log({
            level: "alert",
            message: error.message,
            stack: error.stack,
            userID: firebase.auth().currentUser.uid,
            isLoggedIn: true
          })
          alertWarn(0);
        }
      }) // End of 1st / Initial Query
      console.log(newChannels);
      console.log(newEvents);
      console.log(newThreads);
      commit("setChannels", newChannels);
    }
  }
}
const mutations = {
  setChannels(state, channels) {
    state.channels = channels;
  }
}

export default {
  state, getters, actions, mutations
}

