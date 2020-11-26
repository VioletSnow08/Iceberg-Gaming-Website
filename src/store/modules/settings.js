import * as firebase from 'firebase/app'
import 'firebase/auth'
import {logger, alertWarn, base_url} from "../../../utils";
import axios from "axios";
import store from '../store';
axios.defaults.headers = {
  'Content-Type': 'application/json'
}

const getters = {}
const actions = {
// LOAS

  async submitLOA(context, [end_date, reason]) {
    const accessToken = await store.getters.currentUser.accessToken;
    await axios.post(`${base_url}/settings/loa/submit`, {
      accessToken,
      endDate: end_date,
      reason
    }).then(async () => {
        await context.dispatch("fetchCurrentUser");
    }).catch(error => {
      if(error) {
        alert(error.message);
      }
    })
  },
  async endLOA(context) {
    await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({onLOA: false}).then(async () => {
      logger.log({
        level: "info",
        message: "User ended LOA",
        userID: firebase.auth().currentUser.uid,
        isLoggedIn: true
      })
    }).catch(error => {
      if (error) {
        logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          userID: firebase.auth().currentUser.uid,
          isLoggedIn: true
        })
        alertWarn(0);
      }
    });
    await context.dispatch("fetchCurrentUser");
  },
  async changeDiscordID(context, newID) {
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      discordID: newID
    }).then(async () => {
      logger.log({
        level: "info",
        message: "User changed Discord ID",
        newDiscordID: newID,
        isLoggedIn: true,
        userID: firebase.auth().currentUser.uid
      })
    }).catch(error => {
      if (error) {
        logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          newDiscordID: newID,
          isLoggedIn: true,
          userID: firebase.auth().currentUser.uid
        })
        alertWarn(0);
      }
    })
    await context.dispatch("fetchCurrentUser");
  },
  async changeStatus(context, newStatus) {
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      status: newStatus
    }).then(async () => {
      logger.log({
        level: "info",
        message: "User changed status",
        newStatus,
        isLoggedIn: true,
        userID: firebase.auth().currentUser.uid
      })
    }).catch(error => {
      if (error) {
        logger.log({
          level: "error",
          message: error.message,
          stack: error.stack,
          newStatus,
          isLoggedIn: true,
          userID: firebase.auth().currentUser.uid,
        })
        alertWarn(0);
      }
    })
    await context.dispatch("fetchCurrentUser");
  }, async changeIsEmailPublic(context, newIsEmailPublic) {
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      isEmailPublic: newIsEmailPublic
    }).then(async () => {
      logger.log({
        level: "info",
        message: "User changed isEmailPublic",
        newIsEmailPublic,
        userID: firebase.auth().currentUser.uid,
        isLoggedIn: true
      })
    }).catch(error => {
      if (error) {
        logger.log({
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
