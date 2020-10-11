import * as firebase from 'firebase'
import router from "@/router/router";

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
  async setUser ({commit}) {
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
    if(division === "Iceberg") {
      await firebase.firestore().collection("users").doc(userID).update({
        isIceberg: true,
        isApplicant: false,
        status: "You can now change your status!",
        roles: ["[ICE] Member"]
      })
    } else {
      await firebase.firestore().collection("users").doc(userID).update({
        bct_rank: "RCT",
        status: "You can now change your status!",
        roles: ["[ICE] Member", "[17th] Member", "[17th] Recruit"]
      })
    }
  },
  async registerUser({commit}, [username, email, password, discord_id]) {
    await firebase.auth().createUserWithEmailAndPassword(email, password).then(async () => {
      const user = {
        date: firebase.firestore.Timestamp.now(),
        discord_id,
        bct_eligibleForDemotion: false,
        bct_eligibleForPromotion: false,
        email,
        bct_events_attended: 0,
        onLOA: false,
        photoURL: "https://image.flaticon.com/icons/svg/2919/2919600.svg",
        bct_points: 0,
        bct_rank: "",
        roles: ["[ICE] Member"],
        status: "Iceberg Member",
        username
      }

      await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set(user).then(async () => { // Creates the user in the database
        await this.dispatch('loginUser', [email, password]); // Calls the loginUser function
      }).catch(error => {
        if (error) throw error;
      })
    }).catch(error => {
      if (error) alert(error)
    })

  },

  async loginUser({commit}, [email, password]) {
    await firebase.auth().signInWithEmailAndPassword(email, password).then(async () => {
      await this.dispatch('setUser');
      await router.push('/user/apply')
    }).catch(error => {
      if (error) alert(error)
    })
  },

  async logoutUser({commit}) {
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
