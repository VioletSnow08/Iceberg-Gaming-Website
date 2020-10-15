import * as firebase from 'firebase/app'
import 'firebase/auth'

const getters = {}
const actions = {
// LOAS

  async submitLOA(context, [end_date, reason]) {
    const loa = {
      start_date: await firebase.firestore.Timestamp.now(),
      end_date,
      reason,
      user_id: firebase.auth().currentUser.uid
    }
    await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).collection("loas").doc().set(loa).catch(error => {
      if (error) throw error
    });
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({onLOA: true}).catch(error => {
      if (error) throw error
    });
    await context.dispatch("setUser");
  },
  async endLOA(context) {
    await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({onLOA: false}).catch(error => {
      if (error) throw error;
    })
    await context.dispatch("setUser");
  },
  async changeDiscordID(context, newID) {
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      discord_id: newID
    }).catch(error => {
      if (error) throw error;
    })
    await context.dispatch("setUser");
  },
  async changeStatus(context, newStatus) {
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      status: newStatus
    }).catch(error => {
      if (error) throw error;
    })
    await context.dispatch("setUser");
  },

  async changeIsEmailPublic(context, newIsEmailPublic) {
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({
      isEmailPublic: newIsEmailPublic
    }).catch(error => {
      if (error) throw error;
    })
    await context.dispatch("setUser");
  },
}
const mutations = {

}

export default {
  getters, actions, mutations
}
