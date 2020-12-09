import * as firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router/router'
import axios from "axios";
const utils = require("../../../utils");

axios.defaults.headers = {
  'Content-Type': 'application/json'
}

const state = {
  applications: null
}
const getters = {
  application: (state) => (userID, applicationID) => {
    return state.applications.find(application => (application.userID == userID) && (application.id == applicationID))
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
}

const actions = {
  async submit17thApplication({commit, rootGetters}, [steamURL, age, timezone, arma3Hours, hobbies, whyJoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps]) {
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
    }).catch(error => {
      if(error) {
        utils.alertGeneral();
      }
    })
  },

  async submitIcebergApplication({commit, rootGetters}, [steamURL, age, hoursInGamesTheyJoinFor, hobbies, areYouInAnyCommunities, whereDidYouHearUsFrom, gamesTheyJoinFor, whyJoin]) {
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
      await this.dispatch('fetchCurrentUser');
    }).catch(error => {
      if(error) {
        utils.alertGeneral();
      }
    })
  },

  async fetchApplications({commit, rootGetters}) {
    await axios.post(`${utils.base_url}/applications`, {
      accessToken: await rootGetters.currentUser.accessToken,
    }).then(async response => {
      commit('setApplications', response.data);
    }).catch(error => {
      if(error) {
        utils.alertGeneral();
      }
    })
  },
  async changeApplicationStatus({commit}, [newStatus, userID, applicationID, division]) {
    if (firebase.auth().currentUser) {
      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).get().then(async doc => {
        if (doc.data().roles.includes("[ICE] Recruiter")) {
          let newComment = "";

          if (division === "17th") {
            if (newStatus.toLowerCase() === "processing") {
              newComment = "Your application is currently being held for processing. When you're able to, we request that we interview you(nothing bad!) and that you hop on to the TeamSpeak (ts.iceberg-gaming.com) to reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here."
            } else if (newStatus.toLowerCase() === "accepted") {
              newComment = "Congrats! Your application to the 17th Brigade Combat Team has been accepted! It is our great pleasure to welcome you to the community. " +
                "There are only a couple of things to take care of in order to join us on the battlefield. First we request that you subscribe our shadow mod. You can subscribe to our shadow mod here: " +
                "https://steamcommunity.com/sharedfiles/filedetails/?id=1501538330" +
                " . Second, we request that you hop on the Teamspeak (ts.iceberg-gaming.com) and message a Corporal(CPL) or above to get your roles. If nobody is available, make sure you post it in general chat on our Discord." +
                " Last but not least, we ask that you familiarize yourself with our Code of Conduct, Ranks, and Structure Pages. If you happen to have any questions please feel free to ask around. Until then, we'll see you soon!"
              await this.dispatch("acceptUser", [userID, division]);
            } else if (newStatus.toLowerCase() === "denied") {
              newComment = "We have reviewed your application and we thank you for your interest in the 17th Brigade Combat Team. However, unfortunately we were unable to accept your application at this time. You may inquire about why your application was declined." +
                " You are free to resubmit your application in the future at any time. We are sorry about the inconvenience.";
            }

            await firebase.firestore().collection("users").doc(userID).collection("applications").doc(applicationID).update({
              status: newStatus,
              comment: newComment
            }).then(async () => {
              console.log("updated");
              utils.logger.log({
                level: "info",
                message: "Application Status Changed",
                recruiter: firebase.auth().currentUser.uid,
                isLoggedIn: true,
                userID,
                applicationID,
                division,
                newStatus
              })
            }).catch(error => {
              if(error) {
                utils.logger.log({
                  level: "alert",
                  message: error.message,
                  stack: error.stack,
                  recruiter: firebase.auth().currentUser.uid,
                  isLoggedIn: true,
                  userID,
                  applicationID,
                  division,
                  newStatus
                })
                utils.alertGeneral()
              }
            })
          } else if (division === "Iceberg") {
            if (newStatus.toLowerCase() === "processing") {
              newComment = "Your application is currently being held for processing. When you're able to, we request that we interview you(nothing bad!) and that you hop on to the TeamSpeak (ts.iceberg-gaming.com) to reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here.";
            } else if (newStatus.toLowerCase() === "accepted") {
              newComment = "";
              await this.dispatch("acceptUser", [userID, division]);
            } else if (newStatus.toLowerCase() === "denied") {
              newComment = "We have reviewed your application and we thank you for your interest in Iceberg Gaming. However, unfortunately we were unable to accept your application at this time. You may inquire about why your application was declined." +
                " You are free to resubmit your application in the future at any time. We are sorry about the inconvenience.";
            }

            await firebase.firestore().collection("users").doc(userID).collection("applications").doc(applicationID).update({
              status: newStatus,
              comment: newComment
            }).then(async () => {
              utils.logger.log({
                level: "info",
                message: "Application Status Changed",
                recruiter: firebase.auth().currentUser.uid,
                isLoggedIn: true,
                userID,
                applicationID,
                division,
                newStatus
              })
            }).catch(error => {
              if(error) {
                utils.logger.log({
                  level: "alert",
                  message: error.message,
                  stack: error.stack,
                  recruiter: firebase.auth().currentUser.uid,
                  isLoggedIn: true,
                  userID,
                  applicationID,
                  division,
                  newStatus
                })
                utils.alertGeneral()
              }
            })
          }
        }
      })
    }
  }

}

const mutations = {
  setApplications(state, applications) {
    state.applications = applications
  },
}


export default {
  state,
  getters,
  actions,
  mutations
}
