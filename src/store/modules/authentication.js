import * as firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router'

const state = {

}
const getters = {

}

const actions = {
  async registerUser ([username, email, password, discord_id]) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(async () => {
      const user = {
        username,
        discord_id,
        email,
        status: 'Available',
        photoURL: 'https://image.flaticon.com/icons/svg/2919/2919600.svg',
        role: 'applicant',
        application_status: 'Not Filed'
      }

      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set(user)
      await router.push('/pages/login')
    }).catch(error => {
      if (error) alert(error)
    })
  },

  async loginUser ([email, password]) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(async () => {
      await router.push('/dashboard')
    }).catch(error => {
      if (error) alert(error)
    })
  },
  async logoutUser ({commit}) {
    firebase.auth().signOut().then(() => {
      commit('logoutUser')
      router.push('/pages/login')
    })
  }
}


const mutations = {
  logoutUser (state) {
    state.user = null
    state.member = null
  }

}


export default {
  state,
  getters,
  actions,
  mutations
}
