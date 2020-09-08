import * as firebase from 'firebase'

const state = {
  user: {},
  users: {}

}

const getters = {
  currentUser: state => {
    return state.user
  },
  user: (state) => (id) => {
    return state.users.find(user => user.id === id)
  }
}

const actions = {
  async setUser ({commit}) {
    await firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid).get().then(doc => {
        if (doc.exists) {
          commit('setUser', doc.data())
        }
      }).catch(error => {
        if (error) alert(error)
      })
  },
  async setUsers ({commit}) {
    const users = []
    await firebase
      .firestore()
      .collection('users').get().then(snapshot => {
        snapshot.docs.forEach(doc => {
          const object = { ...doc.data(), id: doc.id}
          users.push(object)
        })
        commit('setUsers', users)
      }).catch(error => {
        if (error) alert(error)
      })
  }
}

const mutations = {
  setUser (state, user) {
    state.user = user
  },
  setUsers (state, users) {
    state.users = users
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
