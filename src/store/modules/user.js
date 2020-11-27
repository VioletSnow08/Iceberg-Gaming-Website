import router from "@/router/router";
import {base_url} from "../../../utils";
import axios from "axios";
import store from '../store';

axios.defaults.headers = {
  'Content-Type': 'application/json'
}

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
  async fetchCurrentUser({commit, rootGetters}) {
    const refreshToken = await localStorage.getItem('refreshToken');
    if (refreshToken) {
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
          if(error) {
            alert(error.message)
          }

        });
    }

  },
  async accessTokenTimer({commit, rootGetters}) {
    setInterval(() => {
      if (rootGetters.currentUser) {
        let accessToken = this.dispatch('fetchAccessToken');
        commit('setAccessToken', accessToken);
      }
    }, 3000);
  },
  async loginUser({commit, rootGetters}, [email, password]) {
    await axios.post(`${base_url}/user/login`, JSON.stringify({email, password})).then((response) => {
      localStorage.setItem('refreshToken', response.data.refreshToken) // No need to stringify, since it is already a string
      this.dispatch('fetchCurrentUser');
      router.push('/user/hub')
    }).catch((error) => {
      if (error) alert(error.message);
    })
  },
  async fetchAccessToken({commit, rootGetters}) {
    if (rootGetters.currentUser) {
      const data = JSON.stringify({
        refreshToken: rootGetters.currentUser.refreshToken
      })
      return await axios.post(`${base_url}/user/refresh_token`, data).then(async (response) => {
        return response.data.accessToken;
      })
    } else return null;
  },
  async logoutUser({commit, rootGetters}) {
    const refreshToken = await localStorage.getItem('refreshToken');
    if (refreshToken) {
      const id = await rootGetters.currentUser.id;
      await axios.delete(`${base_url}/user/logout`, {
        data: {
          refreshToken,
          id
        }
      }).then((response) => {
        localStorage.removeItem('refreshToken');
        commit('logoutUser');
        router.push('/').catch(()=>{});;
      }).catch((error) => {
        if (error) alert(error.message);
      })
    }
  },
  async registerUser({commit, rootGetters}, [username, email, password, discord]) {
    await axios.post(`${base_url}/user/register`, {
      email, password, discord, username
    }).then(response => {
      router.push('/pages/login');
    }).catch((error) => {
      if(error) {
        alert(error.message);
      }
    })
  }
}

const mutations = {
  fetchCurrentUser(state, user) {
    state.user = user;
  },
  setAccessToken(state, accessToken) {
    state.user.accessToken = accessToken;
  },
  logoutUser(state) {
    state.user = null;
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
