import * as firebase from 'firebase'
import router from "@/router/router";
import {logger} from "@/misc";

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
          if (doc.exists) {
            const object = {...doc.data(), id: doc.id}
            commit('setUser', object)
          }
        }).catch(error => {
          if (error) alert(error)
        })
    }
  },
  async fetchUsers ({commit}) {
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
  },
  async acceptUser({commit}, [userID, division]) {
    await firebase.firestore().collection("users").doc(userID).get().then(async doc => {
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
      })
    }
    })
  },
  async registerUser({commit}, [username, email, password, discord]) {
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(async () => {
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
          message: "Account created",
          userID: firebase.auth().currentUser.uid,
          username,
          isLoggedIn: true
        })
        await router.push('/hub')
      }).catch(error => {
        if (error) throw error;
      })
    }).catch(error => {
      if (error) alert(error)
    })

  },

  async loginUser({commit}, [email, password]) {
    await firebase.auth().signInWithEmailAndPassword(email, password).then(async () => {
      await this.dispatch('fetchCurrentUser');
      await router.push('/user/apply')
      logger.info({
        message: "User logged in",
        userID: firebase.auth().currentUser.uid,
        username,
        isLoggedIn: true
      })
    }).catch(error => {
      if (error) alert(error)
    })
  },

  async logoutUser({commit}) {
    let currentID = firebase.auth().currentUser.uid;
    await firebase.auth().signOut().then(async () => {
      commit('logoutUser');
      await router.push('/pages/login')

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
