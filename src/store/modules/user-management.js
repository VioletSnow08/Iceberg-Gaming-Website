import * as firebase from 'firebase/app'
import 'firebase/auth'
import axios from "axios";
import store from '../store';
const utils = require("../../../utils");
axios.defaults.headers = {
  'Content-Type': 'application/json'
}
const state = {

}
const getters = {

}
const actions = {
  async toggle17thRoles({commit, rootGetters}, [roles, userID]) {
    axios.post(`${utils.base_url}/user-management/17th/change-roles`, {
      roles,
      userID,
      accessToken: await rootGetters.currentUser.accessToken
    }).catch(error => {
      if(error) alert("Error: Unauthorized or Server Error! Please make sure you are only selecting roles that you can apply.");
    })
  }
}
const mutations = {

}

export default {
  getters, actions, mutations, state
}
