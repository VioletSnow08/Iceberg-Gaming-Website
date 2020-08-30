import * as firebase from "firebase";

const state = {
  user: null

}

const getters = {
  user: state => {
    return state.user;
  },
}

const actions = {
  async setUser({commit}) {
    await firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid).get().then(doc => {
        if (doc.exists) {
          commit("setUser", doc.data());
        }
      }).catch(error => {
        if (error) alert(error)
      })
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
}



export default {
  state,
  getters,
  actions,
  mutations
}
