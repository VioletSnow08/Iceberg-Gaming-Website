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
  },
  disciplinaryActionForm: (state) => (id) => {
    return state.disciplinary_action_forms.find(form => form.id == id);
  }
};

const actions = {
  async submitDisciplinaryActionReport({rootGetters}, [offender, division, date, whereDidThisOccur, witnesses, explanation, infraction, whatPunishment, reporter]) {
    axios.post(`${utils.base_url}/administrative/disciplinary-action/submit`, {
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
      if (error) {
        utils.alertGeneral();
      }
    })
  },
  async fetchDisciplinaryActionForms({commit, rootGetters}) {
    axios.post(`${utils.base_url}/administrative/disciplinary-action`, {
      accessToken: await rootGetters.currentUser.accessToken
    }).then(response => {
      commit('setDisciplinaryActionForms', response.data);
    }).catch(error => {
      if(error) utils.alertGeneral();
    })
  },
  async submitDisciplinaryActionReview({rootGetters}, [punishment, comment, id]) {
    axios.post(`${utils.base_url}/administrative/disciplinary-action/review`, {
      punishment,
      comment,
      id,
      accessToken: await rootGetters.currentUser.accessToken
    }).then(() => {
      this.dispatch('fetchDisciplinaryActionForms');
    }).catch(error => {
      if (error) {
        utils.alertGeneral();
      }
    })
  },
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
