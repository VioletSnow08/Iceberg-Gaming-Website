import * as firebase from 'firebase'
import router from "@/router/router";
import {logger, alertWarn} from "@/utils";

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
  async fetchCurrentUser ({commit}) {
    if(firebase.auth().currentUser) {
      await firebase
        .firestore()
        .collection('users')
        .doc(firebase.auth().currentUser.uid).get().then(doc => {
          logger.log({
            level: "info",
            message: "Current user fetched",
            userID: firebase.auth().currentUser.uid,
            isLoggedIn: true
          })
          if (doc.exists) {
            const object = {...doc.data(), id: doc.id}
            commit('setUser', object)
          }
        }).catch(error => {
          if(error) {
            logger.log({
              level: "emergency",
              error,
              message: "Unable to fetch current user",
              isLoggedIn: true,
              userID: firebase.auth().currentUser.uid
            })
            alertWarn(0);
          }
        })
    }
  },
  async fetchUsers ({commit}) {
    const users = []
    await firebase
      .firestore()
      .collection('users').get().then(snapshot => {
        logger.log({
          level: "info",
          message: "Users fetched",
          isLoggedIn: true,
          userID: firebase.auth().currentUser.uid
        })
        snapshot.docs.forEach(doc => {
          const object = { ...doc.data(), id: doc.id}
          users.push(object)
        })
        commit('setUsers', users)
      }).catch(error => {
        if (error) {
          logger.log({
            level: "critical",
            error,
            message: "Unable to fetch users",
            isLoggedIn: true,
            userID: firebase.auth().currentUser.uid
          })
          alertWarn(0);
        }
      })
  },
  async acceptUser({commit}, [userID, division]) {
    await firebase.firestore().collection("users").doc(userID).get().then(async doc => {
      logger.log({
        level: "info",
        message: "User fetched",
        isLoggedIn: true,
        userID: firebase.auth().currentUser.uid,
      })
      let newRoles = [];
      let currentRoles = doc.data().roles;
    if(division === "Iceberg") {
      newRoles = currentRoles;
      if(!currentRoles.includes("[ICE] Member")) {
        newRoles.push("[ICE] Member");
      }
      newRoles = newRoles.filter(role => role !== "[ICE] Applicant") // Adds all roles and will ensure that the [ICE] Applicant role is not applied.
      await firebase.firestore().collection("users").doc(userID).update({
        isIceberg: true,
        isApplicant: false,
        status: "You can now change your status!",
        roles: newRoles
      }).then(async () => {
        logger.log({
          level: "info",
          message: "User was accepted",
          division,
          userID,
          recruiter: firebase.auth().currentUser.uid,
          isLoggedIn: true
        })
      }).catch(error => {
        if(error) {
          logger.log({
            level: "error",
            error,
            message: "Unable to update user",
            division,
            userID,
            recruiter: firebase.auth().currentUser.uid,
            isLoggedIn: true
          })
          alertWarn(0);
        }
      })
    } else if(division === "17th") {
      newRoles = currentRoles
      if(!currentRoles.includes("[ICE] Member")) {
        newRoles.push("[ICE] Member");
        newRoles = newRoles.filter(role => role !== "[ICE] Applicant") // Adds all roles and will ensure that the [ICE] Applicant role is not applied.
      }
      newRoles = newRoles.filter(role => !role.startsWith("[17th]")) // Removes all [17th] Roles
      newRoles.push("[17th] Member");
      newRoles.push("[17th] Recruit");
      await firebase.firestore().collection("users").doc(userID).update({
        bct_rank: "RCT",
        status: "You can now change your status!",
        roles: newRoles,
        bct_points: 0,
        bct_events_attended: 0,
        bct_eligibleForDemotion: false,
        bct_eligibleForPromotion: false,
      }).then(async () => {
        logger.log({
          level: "info",
          message: "User was accepted",
          division,
          userID,
          recruiter: firebase.auth().currentUser.uid,
          isLoggedIn: true
        })
      }).catch(error => {
        if(error) {
          logger.log({
            level: "error",
            error,
            message: "Unable to update user",
            division,
            userID,
            recruiter: firebase.auth().currentUser.uid,
            isLoggedIn: true
          })
          alertWarn(0)
        }
      })
    }
    }).catch(error => {
      if(error) {
        logger.log({
          level: "alert",
          message: "Unable to fetch users",
          error,
          division,
          userID,
          recruiter: firebase.auth().currentUser.uid,
          isLoggedIn: true
        })
        alertWarn(0);
      }
    })
  },
  async registerUser({commit}, [username, email, password, discord]) {
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(async () => {
      logger.log({
        level: "info",
        message: "Account created",
        isLoggedIn: false
      })
      const user = {
        date: firebase.firestore.Timestamp.now(),
        discord,
        email,
        onLOA: false,
        photoURL: "https://image.flaticon.com/icons/svg/2919/2919600.svg",
        roles: ["[ICE] Applicant"],
        status: "Make sure to fill out an application!",
        username
      }

      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set(user).then(async () => { // Creates the user in the database
        logger.info({
          message: "User created",
          userID: firebase.auth().currentUser.uid,
          username,
          isLoggedIn: true
        })
        await router.push('/hub')
      }).catch(error => {
        if (error) {
          logger.log({
            level: "alert",
            message: "Unable to register user",
            error,
            isLoggedIn: false,
            username, // Only way to identify the user
            user,
            notes: [
              "Firebase created the account",
              "Firebase was unable to add the user to the database"
            ]
          })
          alertWarn(0);
        }
      })
    }).catch(error => {
      if (error) {
        logger.log({
          level: "alert",
          error,
          message: "Unable to register account",
          isLoggedIn: false,
          username, // Only way to identify the user
          user,
          notes: [
            "Firebase was unable the account",
            "Firebase was unable to add the user to the database"
          ]
        })
        alertWarn(0);
      }
    })
  },

  async loginUser({commit}, [email, password]) {
    await firebase.auth().signInWithEmailAndPassword(email, password).then(async () => {
      await this.dispatch('fetchCurrentUser');
      await router.push('/user/apply')
      logger.info({
        message: "User logged in",
        userID: firebase.auth().currentUser.uid,
        isLoggedIn: true
      })
    }).catch(error => {
      if (error) {
        logger.log({
          level: "emergency",
          message: error.message,
          email, // Only way to identify the user
          stack: error.stack,
          isLoggedIn: false
        })
        alertWarn(0);
      }
    })
  },

  async logoutUser({commit}) {
    let currentID = firebase.auth().currentUser.uid;
    await firebase.auth().signOut().then(async () => {
      commit('logoutUser');
      await router.push('/pages/login')
      logger.info({
        message: "User logged out",
        userID: currentID,
        isLoggedIn: false
      })
    }).catch(error => {
      if(error) {
        logger.log({
          level: "critical",
          message: error.message,
          stack: error.stack,
          isLoggedIn: true,
          userID: firebase.auth().currentUser.uid
        })
        alertWarn(0);
      }
    })
  }
}

const mutations = {
  setUser (state, user) {
    state.user = user
  },
  setUsers (state, users) {
    state.users = users
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
