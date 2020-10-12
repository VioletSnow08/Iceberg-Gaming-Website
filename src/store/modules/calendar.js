import * as firebase from "firebase";
import {remove} from "vue-i18n/src/util";
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
      if(event.division === "Iceberg") {
        events.push(event);
      }
    })
    return events;
  },
  BCTEvents: (state) => {
    let events = [];
    state.events.forEach(event => {
      if(event.division === "17th") {
        events.push(event);
      }
    })
    return events;
  },
  events: (state) => {
    return state.events;
  },
  IcebergEvent: (state) => (eventID) => {
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
    await firebase.firestore().collection('events').doc().set(event).catch(error => {if(error) throw error;})
    commit("addEvent", event);
  },
  async setAttendance({commit}, [eventID, attendance]) {
    await firebase.firestore().collection('events').doc().get(eventID).then(async event => {
      if(event.data()) {
        for(let i = 0; i < event.data().going.length; i++) {
          if(event.data().going[i] === firebase.auth().currentUser.uid) {
            event.going = event.going.splice(i, 1);
            await firebase.firestore().collection('events').doc(eventID).set(event).catch(removeAttendanceError => {
              if(removeAttendanceError) throw removeAttendanceError;
            })
          }
        }
        for(let i = 0; i < event.data().maybe.length; i++) {
          if(event.data().maybe[i] === firebase.auth().currentUser.uid) {
            event.maybe = event.maybe.splice(i, 1);
            await firebase.firestore().collection('events').doc(eventID).set(event).catch(removeAttendanceError => {
              if(removeAttendanceError) throw removeAttendanceError;
            })
          }
        }
        for(let i = 0; i < event.data().declined.length; i++) {
          if(event.data().declined[i] === firebase.auth().currentUser.uid) {
            event.declined = event.declined.splice(i, 1);
            await firebase.firestore().collection('events').doc(eventID).set(event).catch(removeAttendanceError => {
              if(removeAttendanceError) throw removeAttendanceError;
            })
          }
        }
        if(attendance === "going") {
          event.going.push(firebase.auth().currentUser.uid);
        } else if(attendance === "maybe") {
          event.maybe.push(firebase.auth().currentUser.uid);
        } else if(attendance === "declined") {
          event.declined.push(firebase.auth().currentUser.uid);
        }
      }
    })
  }
}
const mutations = {
  setEvents(state, events) {
    state.events = events;
  },
  addEvent(state, event) {
    state.events.push(event);
  }
}
export default {
  state, getters, actions, mutations
}

