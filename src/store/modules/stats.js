import * as firebase from "firebase/app";
import "firebase/auth";
import router from "@/router";

const state = {
  stats: {}
}
const getters = {
  stats: state => {
    return state.stats;
  }
}

const actions = {
  async setStats({commit}) {
    await firebase.firestore().collection("stats").doc("stats").get().then(doc => {
      if (doc.exists) {
        commit('setStats', doc.data());
      }
    })
  }
}

const mutations = {
  setStats(state, stats) {
    state.stats = stats;
  }

}


export default {
  state,
  getters,
  actions,
  mutations
}
