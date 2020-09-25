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
  }
}
const actions = {
  async fetchEvents({commit}) {
    let list = [];
    await firebase.firestore().collection('events').get().then(async events => {
      for (const event of events.docs) {
        const object = {...event.data(), id: event.id, startDate: formatDate(event.data().startDate.toDate()), endDate: formatDate(event.data().endDate.toDate())}
        list.push(object);
      }
    })
    commit("setEvents", list);
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

