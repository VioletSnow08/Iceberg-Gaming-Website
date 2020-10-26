import * as firebase from "firebase";

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}


const state = {
  events: null
}
const getters = {
  IcebergEvents: (state) => {
    let events = [];
    state.events.forEach(event => {
      if (event.division === "Iceberg") {
        events.push(event);
      }
    })
    return events;
  },
  BCTEvents: (state) => {
    let events = [];
    state.events.forEach(event => {
      if (event.division === "17th") {
        events.push(event);
      }
    })
    return events;
  },
  events: (state) => {
    return state.events;
  },
  event: (state) => (eventID) => {
    return state.events.find(event => event.division === "Iceberg" && event.id === eventID);
  },
}
const actions = {
  async fetchEvents({commit}) {
    let list = [];
    await firebase.firestore().collection('events').get().then(async events => {
      for (const event of events.docs) {
        const object = {...event.data(), id: event.id}
        list.push(object);
      }
    })
    commit("setEvents", list);
  },
  async addEvent({commit}, event) {
    event.creatorID = firebase.auth().currentUser.uid;
    await firebase.firestore().collection('events').doc().set(event).catch(error => {
      if (error) throw error;
    })
    await this.dispatch("fetchEvents");
  },
  async setAttendance({commit}, [eventID, attendance]) {
    await firebase.firestore().collection('events').doc(eventID).get().then(async event => {
      if (event.data()) {
        await firebase.firestore().collection('events').doc(eventID).update({
          going: event.data().going.filter(person => person !== firebase.auth().currentUser.uid),
          maybe: event.data().maybe.filter(person => person !== firebase.auth().currentUser.uid),
          declined: event.data().declined.filter(person => person !== firebase.auth().currentUser.uid)
        }).catch(update => {
          if (update) throw update
        })
      }
    }).catch(error => {
      if (error) throw error;
    })

    await firebase.firestore().collection('events').doc(eventID).get().then(async event => {
      if (event.data()) {
        if (attendance === "going") {
          let newArray = event.data().going;
          newArray.push(firebase.auth().currentUser.uid);
          await firebase.firestore().collection('events').doc(eventID).update({
            going: newArray
          })
        } else if (attendance === "maybe") {
          let newArray = event.data().maybe;
          newArray.push(firebase.auth().currentUser.uid);
          await firebase.firestore().collection('events').doc(eventID).update({
            maybe: newArray
          })
        } else if (attendance === "declined") {
          let newArray = event.data().declined;
          newArray.push(firebase.auth().currentUser.uid);
          await firebase.firestore().collection('events').doc(eventID).update({
            declined: newArray
          })
        }
      }
      await this.dispatch("fetchEvents");
    })
  },
  async editEvent({commit}, [eventID, title, label, startDate, endDate, style]) {
    if(title) {
      await firebase.firestore().collection('events').doc(eventID).update({
        title
      })
    }
    if(label) {
      await firebase.firestore().collection('events').doc(eventID).update({
        label
      })
    }
    if(startDate) {
      await firebase.firestore().collection('events').doc(eventID).update({
        startDate
      })
    }
    if(endDate) {
      await firebase.firestore().collection('events').doc(eventID).update({
        endDate
      })
    }
    if(style) {
      await firebase.firestore().collection('events').doc(eventID).update({
        style
      })
    }
    await this.dispatch("fetchEvents");
  }
}
const mutations = {
  setEvents(state, events) {
    state.events = events;
  }
}
export default {
  state, getters, actions, mutations
}

