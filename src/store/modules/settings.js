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
      if(error) throw error;
    })
    await context.dispatch("setUser");
  },
  async changeStatus(context, newStatus) {
    await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).update({status: newStatus}).catch(error => {
      if(error) throw error;
    })
    context.commit("changeStatus", newStatus);
  }
}
const mutations = {
  changeStatus(state, newStatus) {
    console.log(state); // Is only calling this local state
    state.user.status = newStatus;
  }
}

export default {
  getters, actions, mutations
}