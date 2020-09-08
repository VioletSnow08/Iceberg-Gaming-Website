import * as firebase from 'firebase'

const state = {
  member: {}

}
const getters = {
  member: state => {
    return state.member
  },
  pointsSeries: state => {
    return [
      {
        name: 'Points',
        data: [state.member.points3, state.member.points2, state.member.points]
      }
    ]
  }
}
const actions = {
  async setMember ({commit}) {
    await firebase
      .firestore()
      .collection('members')
      .doc(firebase.auth().currentUser.uid).get().then(async doc => {
        if (doc.exists) {
          commit('setMember', doc.data())
        }
      }).catch(error => {
        if (error) alert(error)
      })
  }
}

const mutations = {
  setMember (state, member) {
    state.member = member
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
