import * as firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router/router'
import axios from "axios";

const utils = require("../../../utils");

axios.defaults.headers = {
  'Content-Type': 'application/json'
}
const state = {
  members: null
};

const getters = {
  bctMembers: (state) => {
    return state.members.filter(member => member.division.toLowerCase() === "17th");
  },
  icebergMembers: (state) => {
    return state.members.filter(member => member.division.toLowerCase() === "iceberg");
  },
  members: (state) => {
    return state.members;
  }
};

const actions = {
  async fetch17thMembers({commit, rootGetters}) {
    axios.post(`${utils.base_url}/members/17th`, {
      accessToken: await rootGetters.currentUser.accessToken
    }).then(response => {
      commit('set17thMembers', response.data);
    }).catch(error => {
      if (error) utils.alertGeneral();
    })
  }
};

const mutations = {
  set17thMembers(state, members) {
    state.members = members;
  }
};


export default {
  state,
  getters,
  actions,
  mutations
}
