import * as firebase from 'firebase'
import router from "@/router/router";
import {logger, alertWarn, base_url} from "../../../utils";
import axios from "axios";

axios.defaults.headers = {
  'Content-Type': 'application/json'
}
import store from '../store';

/** in my case, it should be js file. */

const state = {
  user: null,
  users: null

}

const getters = {
  currentUser: state => {
    return state.user
  },
  user: (state) => (id) => {
    return state.users.find(user => user.id === id)
  },
  users: state => {
    return state.users;
  }
}

const actions = {
  async fetchCurrentUser({commit}) {
    // TODO: Return if no refreshToken
    const refreshToken = await localStorage.getItem('refreshToken');
    const accessToken = await this.dispatch('fetchAccessToken');
    await axios.post(`${base_url}/user/`, JSON.stringify({refreshToken}))
      .then(function (response) {
        let user = {
          ...response.data,
          refreshToken,
          accessToken
        }
        commit('fetchCurrentUser', user);
      }).catch(function (error) {
        console.log(error);
      });
  },
  async accessTokenTimer({commit}) {
    setInterval(() => {
      let accessToken = this.dispatch('fetchAccessToken');
      commit('setAccessToken', accessToken);
    }, 3000);
  },
  async loginUser({commit}, [email, password]) {
    // await firebase.auth().signInWithEmailAndPassword(email, password).then(async () => {
    //   await this.dispatch('fetchCurrentUser');
    //   await router.push('/user/apply')
    //   logger.info({
    //     message: "User logged in",
    //     userID: firebase.auth().currentUser.uid,
    //     isLoggedIn: true
    //   })
    // }).catch(error => {
    //   if (error) {
    //     logger.log({
    //       level: "emergency",
    //       message: error.message,
    //       email, // Only way to identify the user
    //       stack: error.stack,
    //       isLoggedIn: false
    //     })
    //     alertWarn(0);
    //   }
    // })
    await axios.post(`${base_url}/user/login`, JSON.stringify({email, password})).then(async (response) => {
      await localStorage.setItem('refreshToken', response.data.refreshToken) // No need to stringify, since it is already a string
      await this.dispatch('fetchCurrentUser');
      await router.push('/user/hub')
    }).catch((error) => {
      if (error) throw error;
    })
  },
  async fetchAccessToken({commit}) {
    if (store.getters.currentUser) {
      const data = JSON.stringify({
        refreshToken: store.getters.currentUser.refreshToken
      })
      return await axios.post(`${base_url}/user/refresh_token`, data).then(async (response) => {
        const accessToken = response.data.accessToken;
        return accessToken;
      })
    } else return null;
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user
  },
  setUsers(state, users) {
    state.users = users
  },
  logoutUser(state) {
    state.user = null;
  },
  fetchCurrentUser(state, user) {
    state.user = user;
  },
  setAccessToken(state, accessToken) {
    state.user.accessToken = accessToken;
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
