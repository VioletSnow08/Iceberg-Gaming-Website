import router from "@/router/router";

const utils = require("../../../utils");
import axios from "axios";
import store from '../store';

axios.defaults.headers = {
  'Content-Type': 'application/json'
}

const state = {
  channels: null
}

const getters = {
  channels: (state) => {
    return state.channels;
  },
  channel: (state) => (id) => {
    return state.channels.find(c => c.id == id); // Double == is because of the text vs int difference
  },
  events: (state) => (channelID) => {
    return state.channels.find(c => c.id == channelID).events;
  },
  event: (state) => (channelID, eventID) => {
    return state.channels.find(c => c.id == channelID).events.find(e => e.id == eventID);
  },
  documents: (state) => (channelID) => {
    return state.channels.find(c => c.id == channelID).documents;
  },
  document: (state) => (channelID, documentID) => {
    return state.channels.find(c => c.id == channelID).documents.find(d => d.id == documentID);
  },
  topics: (state) => (channelID) => {
    return state.channels.find(c => c.id == channelID).topics;
  },
  topic: (state) => (channelID, topicID) => {
    return state.channels.find(c => c.id == channelID).topics.find(t => t.id == topicID);
  },
  replies: (state) => (channelID, topicID) => {
    return state.channels.find(c => c.id == channelID).topics.find(t => t.id == topicID).replies;
  },
}

const actions = {
  async fetchChannels({commit, rootGetters}) {
    axios.post(`${utils.base_url}/channels`, {
      accessToken: await rootGetters.currentUser.accessToken
    }).then(response => {
      commit('setChannels', response.data)
    })
  },
  async createChannel({rootGetters}, [name, type, division]) {
    axios.post(`${utils.base_url}/channels/create`, {
      accessToken: await rootGetters.currentUser.accessToken,
      name,
      type,
      division
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },

  async editChannel({rootGetters}, [name, id]) {
    axios.post(`${utils.base_url}/channels/edit`, {
      accessToken: await rootGetters.currentUser.accessToken,
      name,
      id
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async deleteChannel({rootGetters}, id) {
    axios.post(`${utils.base_url}/channels/delete`, {
      accessToken: await rootGetters.currentUser.accessToken,
      id
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },

  async createEvent({rootGetters}, [channelID, startDateTime, endDateTime, color, title, description]) {
    axios.post(`${utils.base_url}/channels/calendar/event/create`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      startDateTime,
      endDateTime,
      color,
      title,
      description
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async deleteEvent({rootGetters}, [channelID, eventID]) {
    axios.post(`${utils.base_url}/channels/calendar/event/delete`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      eventID
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async editEvent({rootGetters}, [channelID, startDateTime, endDateTime, color, title, description, eventID]) {
    axios.post(`${utils.base_url}/channels/calendar/event/edit`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      startDateTime,
      endDateTime,
      color,
      title,
      description,
      eventID
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async setAttendance({rootGetters}, [channelID, eventID, userID, status]) {
    axios.post(`${utils.base_url}/channels/calendar/event/set-attendance`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      eventID,
      userID,
      status
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },

  async uploadDocument({rootGetters}, [formData]) {
    return axios.post(`${utils.base_url}/channels/documents/create`, formData) // Returns a promise only because there is a higher chance of failure with files, so I want error handling to be dealt with within the component.
  },
  async fetchDocument({rootGetters}, [channelID, documentID, filename]) {
    return await axios.post(`${utils.base_url}/channels/document`, {
      channelID,
      documentID,
      filename,
      accessToken: await rootGetters.currentUser.accessToken
    }, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/pdf'
      }
    })
  },
  async editDocument({rootGetters}, [channelID, documentID, filename, name]) {
    axios.post(`${utils.base_url}/channels/documents/edit`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      documentID,
      name,
      filename
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async deleteDocument({rootGetters}, [channelID, documentID, filename]) {
    axios.post(`${utils.base_url}/channels/documents/delete`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      documentID,
      filename
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async createTopic({rootGetters}, [channelID, title, body]) {
    axios.post(`${utils.base_url}/channels/forums/topics/create`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      title,
      body
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async createReply({rootGetters}, [channelID, topicID, body]) {
    axios.post(`${utils.base_url}/channels/forums/topics/replies/create`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      topicID,
      body
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async deleteReply({rootGetters}, [channelID, topicID, replyID]) {
    axios.post(`${utils.base_url}/channels/forums/topics/replies/delete`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      topicID,
      replyID
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async deleteTopic({rootGetters}, [channelID, topicID]) {
    axios.post(`${utils.base_url}/channels/forums/topics/delete`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      topicID,
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  }
}

const mutations = {
  setChannels(state, channels) {
    state.channels = channels;
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
