import * as firebase from 'firebase/app'
import 'firebase/auth'
import axios from "axios";
import store from '../store';
const utils = require("../../../utils");
axios.defaults.headers = {
  'Content-Type': 'application/json'
}

const getters = {}
const actions = {
// LOAS

  async submitLOA(context, [end_date, reason]) {
    const accessToken = await store.getters.currentUser.accessToken;
    await axios.post(`${utils.base_url}/settings/loa/submit`, {
      accessToken,
      endDate: end_date,
      reason
    }).then(async () => {
        await context.dispatch("fetchCurrentUser");
    }).catch(error => {
      if(error) {
        utils.alertGeneral()
      }
    })
  },
  async endLOA({dispatch, rootGetters}, [userID, loaID]) { // Allows admins to end another user's LOA
    await axios.post(`${utils.base_url}/settings/loa/end`, {
      accessToken: await rootGetters.currentUser.accessToken,
      userID,
      loaID
    }).then(async () => {
      await dispatch("fetchCurrentUser");
      if(userID !== rootGetters.currentUser.id) { // To prevent too many queries ~ Meaning an admin ran this function.
        await dispatch("fetchUsers");
      }
    }).catch(error => {
      if(error) {
        utils.alertGeneral()
      }
    })
  },
  async changeDiscord({dispatch, rootGetters}, [discord, userID]) {
    await axios.post(`${utils.base_url}/settings/discord`, {
      accessToken: await rootGetters.currentUser.accessToken,
      userID,
      discord
    }).then(async () => {
      await dispatch("fetchCurrentUser");
      if(userID !== rootGetters.currentUser.id) { // To prevent too many queries ~ Meaning an admin ran this function.
        await dispatch("fetchUsers");
      }
    }).catch(error => {
      if(error) {
        utils.alertGeneral()
      }
    })
  }, async changeStatus({dispatch, rootGetters}, [status, userID]) {
    await axios.post(`${utils.base_url}/settings/status`, {
      accessToken: await rootGetters.currentUser.accessToken,
      userID,
      status
    }).then(async () => {
      await dispatch("fetchCurrentUser");
      if(userID !== rootGetters.currentUser.id) { // To prevent too many queries ~ Meaning an admin ran this function.
        await dispatch("fetchUsers");
      }
    }).catch(error => {
      if(error) {
        utils.alertGeneral()
      }
    })
  }, async changeIsEmailPublic(context, newIsEmailPublic) {
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      isEmailPublic: newIsEmailPublic
    }).then(async () => {
      utils.logger.log({
        level: "info",
        message: "User changed isEmailPublic",
        newIsEmailPublic,
        userID: firebase.auth().currentUser.uid,
        isLoggedIn: true
      })
    }).catch(error => {
      if (error) {
        utils.logger.log({
          level: "error",
          newIsEmailPublic,
          userID: firebase.auth().currentUser.uid,
          isLoggedIn: true,
          message: error.message,
          stack: error.stack,
        })
        alertWarn(0);
      }
    })
    await context.dispatch("fetchCurrentUser");
  },
}
const mutations = {}

export default {
  getters, actions, mutations
}
