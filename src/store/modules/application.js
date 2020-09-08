import * as firebase from 'firebase/app'
import 'firebase/auth'
import router from '@/router'
const state = {
  application: {},
  applications: {}
}
const getters = {
  application: state => {
    return state.application
  },
  applications: state => {
    return state.applications
  },
  viewApplication: (state) => (id) => {
    return state.applications.find(t => { return t.id === id })
  }
}

const actions = {
  async submitApplication ({commit}, [steamURL, age, timezone, arma3Hours, hobbies, whyjoin, attractmilsim, ranger, medic, sapper, pilot, tank_crew, idf, attendOps]) {
    if (firebase.auth().currentUser) {
      const interestedRoles = []
      if (ranger) {
        interestedRoles.push('Ranger')
      }
      if (medic) {
        interestedRoles.push('Medic')
      }
      if (sapper) {
        interestedRoles.push('Sapper')
      }
      if (pilot) {
        interestedRoles.push('Pilot')
      }
      if (tank_crew) {
        interestedRoles.push('Tank Crew')
      }
      if (idf) {
        interestedRoles.push('IDF Support')
      }
      const application = {
        steamURL,
        age,
        timezone,
        arma3Hours,
        hobbies,
        whyjoin,
        attractmilsim,
        attendOps,
        interestedRoles,
        status: 'waiting',
        reply: '',
        replier: ''
      }
      await firebase.firestore().collection('applications').doc(firebase.auth().currentUser.uid).set(application).then(async () => {
        commit('setApplication', application)
        await router.push('/application')
      }).catch(error => {
        if (error) throw error
      })


    }
  },
  async setApplication ({commit}) {
    await firebase.firestore().collection('applications').doc(firebase.auth().currentUser.uid).get().then(doc => {
      if (doc.exists) {
        commit('setApplication', doc.data())
      }
    }).catch(error => {
      if (error) alert(error)
    })
  },

  async setApplications ({commit}) {
    const newApplications = []
    await firebase.firestore().collection('members').doc(firebase.auth().currentUser.uid).get().then(async doc => {
      if (doc.data().roles.includes('Recruiter')) {
        await firebase.firestore().collection('applications').get().then(snapshot => {
          snapshot.docs.forEach(doc => {
            const object = { ...doc.data(), id: doc.id}
            newApplications.push(object)
          })
        })
        commit('setApplications', newApplications)
      }
    })
  },

  async changeApplicationStatus ({commit}, [newStatus, applicationID]) {
    await firebase.firestore().collection("members").doc(firebase.auth().currentUser.uid).get().then(async firstDoc => {
      if(firstDoc.data().roles.includes("Recruiter")) {
        let newComment = "";
        if(newStatus.toLowerCase() === "processing") {
          newComment = "Your application is currently being held for processing. When you're able to, we request that we interview you(nothing bad!) and that you hop on to the TeamSpeak (ts.iceberg-gaming.com) to reach out to a recruiter! They'll be able to answer your questions and fill you in how things work here."
        } else if(newStatus.toLowerCase() === "accepted") {
          newComment = "Congrats! Your application to the 17th Brigade Combat Team has been accepted! It is our great pleasure to welcome you to the community. " +
            "There are only a couple of things to take care of in order to join us on the battlefield. First we request that you subscribe our shadow mod. You can subscribe to our shadow mod here: " +
            "https://steamcommunity.com/sharedfiles/filedetails/?id=1501538330" +
            " . Second, we request that you hop on the Teamspeak (ts.iceberg-gaming.com) and message a Corporal(CPL) or above to get your roles. If nobody is available, make sure you post it in general chat on our Discord." +
            " Last but not least, we ask that you familiarize yourself with our Code of Conduct, Ranks, and Structure Pages. If you happen to have any questions please feel free to ask around. Until then, we'll see you soon!"
        } else if(newStatus.toLowerCase() === "declined") {
          newComment = "We have reviewed your application and we thank you for your interest in the 17th Brigade Combat Team. However, unfortunately we were unable to accept your application at this time. You may inquire about why your application was declined." +
            " You are free to resubmit your application in the future at any time. We are sorry about the inconvenience."
        }
        await firebase.firestore().collection("applications").doc(applicationID).update({
          status: newStatus,
          comment: newComment
        })
      }
    })
  }

}

const mutations = {
  setApplication (state, application) {
    state.application = application
  },
  setApplications (state, applications) {
    state.applications = applications
  }
}


export default {
  state,
  getters,
  actions,
  mutations
}
