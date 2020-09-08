import * as firebase from 'firebase/app'
import 'firebase/auth'

const state = {
  stats: {}
}
const getters = {
  stats: state => {
    return state.stats
  }
}

const actions = {
  async setStats ({commit}) {
    await firebase.firestore().collection('stats').doc('stats').get().then(doc => {
      if (doc.exists) {
        commit('setStats', doc.data())
      }
    })
    let waiting = 0
    await firebase.firestore().collection('applications').get().then(snapshot => {
      snapshot.docs.forEach(doc => {
        if (doc.data().status === 'waiting') {
          waiting++
        }
      })
    })
    commit('setWaiting', waiting)
  }
}

const mutations = {
  setStats (state, stats) {
    state.stats = stats
  },
  setWaiting (state, waiting) {
    state.stats.waiting = waiting
  }

}


export default {
  state,
  getters,
  actions,
  mutations
}
