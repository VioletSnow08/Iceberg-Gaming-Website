import * as firebase from "firebase/app";
import "firebase/auth";
import router from "@/router";

const defaults = {}
const state = {

}
const getters = {

}

const actions = {
  async submitApplication({commit}, [username, steamURL, age, timezone, arma3Hours, hobbies, whyjoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps]) {
    if (firebase.auth().currentUser) {
      let interestedRoles = [];
      if (ranger) {
        interestedRoles.push("Ranger");
      }
      if (medic) {
        interestedRoles.push("Medic");
      }
      if (sapper) {
        interestedRoles.push("Sapper");
      }
      if (pilot) {
        interestedRoles.push("Pilot");
      }
      if (tank_crew) {
        interestedRoles.push("Tank Crew");
      }
      if (idf) {
        interestedRoles.push("IDF Support");
      }
      const application = {
        username,
        steamURL,
        age,
        timezone,
        arma3Hours,
        hobbies,
        whyjoin,
        attractmilsim,
        attendOps,
        interestedRoles,
        status: "waiting",
        reply: "",
        replier: ""
      }
      await firebase.firestore().collection("applications").doc(firebase.auth().currentUser.uid).set(application).then(async () => {
        commit('setApplication', application)
        await router.push("/application");
      }).catch(error => {
        if(error) throw error;
      })


    }
  }
}

const mutations = {

}


export default {
  state,
  getters,
  actions,
  mutations
}
