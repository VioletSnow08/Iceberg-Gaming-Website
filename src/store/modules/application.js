import * as firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router/router'
import axios from "axios";

const utils = require("../../../utils");

axios.defaults.headers = {
  'Content-Type': 'application/json'
}

const state = {
  applications: null,
  bct_applications: null,
  iceberg_applications: null
}
const getters = {
  application: (state) => (applicationID) => {
    let app = state.applications.find(application => application.id == applicationID);
    if(app) {
      if (app.division.toLowerCase() === "17th") {
        return state.bct_applications.find(application => application.id === app.applicationID);
      } else if (app.division.toLowerCase() === "iceberg") {
        return state.iceberg_applications.find(application => application.id === app.applicationID);
      }
    }
  },
  applications: (state) => {
    return state.applications;
  },
  applicationsFromUser: (state) => (userID) => {
    let applications = [];
    state.applications.forEach(application => {
      if (application.userID === userID) {
        applications.push(application);
      }
    })
    return applications;
  },
  mostRecent17thApplication: (state) => (userID) => {
    let applications = [];
    state.applications.forEach(application => {
      if (application.userID === userID && application.division === "17th") {
        applications.push(application);
      }
    })
    let application = applications[applications.length - 1];
    if (application) {
      return application;
    } else {
      return false;
    }
  }
}

const actions = {
  async submit17thApplication({
                                commit,
                                rootGetters
                              }, [steamURL, age, timezone, arma3Hours, hobbies, whyJoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps]) {
    axios.post(`${utils.base_url}/applications/create/17th`, {
      steamURL,
      age,
      timezone,
      arma3Hours,
      hobbies,
      whyJoin,
      attractmilsim,
      ranger,
      medic,
      sapper,
      pilot,
      tank_crew,
      idf,
      attendOps,
      accessToken: await rootGetters.currentUser.accessToken
    }).then(async response => {
      await this.dispatch('fetchCurrentUser');
      await router.push('/user/applications');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },

  async submitIcebergApplication({
                                   commit,
                                   rootGetters
                                 }, [steamURL, age, hoursInGamesTheyJoinFor, hobbies, areYouInAnyCommunities, whereDidYouHearUsFrom, gamesTheyJoinFor, whyJoin]) {
    axios.post(`${utils.base_url}/applications/create/iceberg`, {
      steamURL,
      age,
      hoursInGamesTheyJoinFor,
      hobbies,
      areYouInAnyCommunities,
      whereDidYouHearUsFrom,
      gamesTheyJoinFor,
      whyJoin,
      accessToken: await rootGetters.currentUser.accessToken
    }).then(async response => {
      await this.dispatch('fetchApplications');
      await router.push('/user/applications');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },

  async fetchApplications({commit, rootGetters}) {
    await axios.post(`${utils.base_url}/applications`, {
      accessToken: await rootGetters.currentUser.accessToken,
    }).then(async response => {
      commit('setApplications', response.data.applications);
      commit('set17thApplications', response.data.bct_applications);
      commit('setIcebergApplications', response.data.iceberg_applications);
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async changeApplicationStatus({commit, rootGetters}, [newStatus, userID, applicationID, division]) {
    axios.delete(`${utils.base_url}/applications/change`, {
      data: {
        action: newStatus,
        division,
        id: applicationID,
        accessToken: await rootGetters.currentUser.accessToken
      }
    }).then(response => {
      this.dispatch('fetchApplications');
      if (rootGetters.currentUser.id === 27) {
        alert("Fuk u street i hope u step on a dam lego")
      }
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  }

}

const mutations = {
  setApplications(state, applications) {
    state.applications = applications
  },
  set17thApplications(state, applications) {
    state.bct_applications = applications
  },
  setIcebergApplications(state, applications) {
    state.iceberg_applications = applications
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}
