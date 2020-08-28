import * as firebase from "firebase/app";
import "firebase/auth";
import router from "@/router";
const defaults = {
  state: {
    user: null,
    member: null,
    application: null
  }
}
const state = {
  user: defaults.state.user,
  member: defaults.state.member,
  application: defaults.state.application

}
const getters = {
  user: state => {
    return state.user;
  },
  member: state => {
    return state.member;
  },
  application: state => {
    return state.application;
  }
}

const actions = {
  async registerUser({commit}, [username, email, password, discord_id]) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(async () => {
      const user = {
        username,
        discord_id,
        email,
        status: "Available",
        photoURL: "https://image.flaticon.com/icons/svg/2919/2919600.svg",
        role: "user",
        application_status: "Not Filed"
      }

      await firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set(user)
      await router.push("/pages/login");
    }).catch(error => {
      if (error) alert(error);
    })
  },

  async loginUser({commit}, [email, password]) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(async () => {
      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid).get().then(doc => {
          commit("setLoginUser", doc.data());
        }).catch(error => {
          if(error) alert(error)
        })
      await firebase.firestore().collection("members").doc(firebase.auth().currentUser.uid).get().then(doc => {
        if (doc.exists) {
          commit("setLoginMember", doc.data());
        }
      }).catch(error => {
        if(error) alert(error)
      })
      await firebase.firestore().collection("applications").doc(firebase.auth().currentUser.uid).get().then(doc => {
        if (doc.exists) {
          commit("setApplication", doc.data());
        }
      }).catch(error => {
        if(error) alert(error)
      })
      await router.push("/dashboard");
    }).catch(error => {
      if (error) alert(error);
    })
  },
  async logoutUser({commit}) {
    firebase.auth().signOut().then(() => {
      commit("logoutUser");
      router.push('/pages/login');
    })
  },
  async setLogin({commit}) {
    firebase.auth().onAuthStateChanged(async () => {
      if (firebase.auth().currentUser) {
        await firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid).get().then(doc => {
            if(doc.exists) {
              commit("setLoginUser", doc.data());
            }
          }).catch(error => {
            if(error) alert(error)
          })

        await firebase
          .firestore()
          .collection("members")
          .doc(firebase.auth().currentUser.uid).get().then(doc => {
            if(doc.exists) {
              commit("setLoginMember", doc.data());
            }
          }).catch(error => {
            if(error) alert(error)
          })

        await firebase
          .firestore()
          .collection("applications")
          .doc(firebase.auth().currentUser.uid).get().then(doc => {
            if(doc.exists) {
              commit("setApplication", doc.data());
            }
          }).catch(error => {
            if(error) alert(error)
          })
      }
    })
  }
}

const mutations = {
  logoutUser(state) {
    state.user = defaults.state.user;
    state.member = defaults.state.member;
  },
  setLoginUser(state, user) {
    state.user = user;
  },
  setLoginMember(state, member) {
    state.member = member;
  },
  setApplication(state, application) {
    state.application = application;
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
