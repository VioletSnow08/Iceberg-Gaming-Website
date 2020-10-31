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

}
const mutations = {
  setChannels(state, channels) {
    state.channels = channels;
  }
}

export default {
  state, getters, actions, mutations
}

