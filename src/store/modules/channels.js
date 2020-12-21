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
  }
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
      if(error) {
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
      if(error) {
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
      if(error) {
        utils.alertGeneral();
      }
    })
  },

  async createEvent({rootGetters}, [channelID, startDateTime, endDateTime, color, title]) {
    axios.post(`${utils.base_url}/channels/calendar/event/create`, {
      accessToken: await rootGetters.currentUser.accessToken,
      channelID,
      startDateTime,
      endDateTime,
      color,
      title
    }).then(() => {
      this.dispatch('fetchChannels');
    }).catch(error => {
      if(error) {
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
