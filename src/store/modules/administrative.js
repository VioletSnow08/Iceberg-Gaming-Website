import * as firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router/router'
import axios from "axios";

const utils = require("../../../utils");

axios.defaults.headers = {
  'Content-Type': 'application/json'
}
const state = {
  disciplinary_action_forms: null
};

const getters = {
  disciplinaryActionForms: (state) => {
    return state.disciplinary_action_forms;
  }
};

const actions = {
  async submitDisciplinaryActionReport({rootGetters}, [offender, division, date, whereDidThisOccur, witnesses, explanation, infraction, whatPunishment, reporter]) {
    axios.post(`${utils.base_url}/administrative/disciplinary-action`, {
      offender,
      division,
      date,
      whereDidThisOccur,
      witnesses,
      explanation,
      infraction,
      whatPunishment,
      reporter,
      accessToken: await rootGetters.currentUser.accessToken
    }).then(() => {
      this.dispatch('fetchDisciplinaryActionForms');
      router.push('/hub');
    }).catch(error => {
      if(error) {
        utils.alertGeneral();
      }
    })
  }
}

const mutations = {
  setDisciplinaryActionForms(state, forms) {
    state.disciplinary_action_forms = forms;
  }
};


export default {
  state,
  getters,
  actions,
  mutations
}
