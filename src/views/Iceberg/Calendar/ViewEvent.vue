<template>
  <div>
    <div v-if="!events || !users">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Event..."}) }}</h1>
    </div>
    <div v-else-if="event($route.params.eventID) && users">
      {{ this.$vs.loading.close() }}
      <h1>
        {{ event($route.params.eventID).title }}
        <span v-if="canUserEdit">
          <vs-button 
            color="primary"
            type="filled"
            icon="edit"
            style="float: right !important">
          </vs-button>
        </span>
      </h1>
      <h2>Hosted by: {{ user(event($route.params.eventID).creatorID).username }}</h2>
      <h3>Start Date: {{ new Date(event($route.params.eventID).startDate) }}</h3>
      <h3>End Date: {{ new Date(event($route.params.eventID).endDate) }}</h3>
      <h4>Going: {{ event($route.params.eventID).going.length }}</h4>
      <h4>Maybe: {{ event($route.params.eventID).maybe.length }}</h4>
      <h4>Declined: {{ event($route.params.eventID).declined.length }}</h4>
      <br>
      <hr>
      <br>
      <div class="text-center">
        <vs-button @click="setAttendance([$route.params.eventID, 'going'])" class="attendance-buttons" :type="event($route.params.eventID).going.find(person => person === currentUser.id) ? 'filled' : 'border'"
                   color="success">Going
        </vs-button>
        <vs-button @click="setAttendance([$route.params.eventID, 'maybe'])" class="attendance-buttons" color="warning"
                   :type="event($route.params.eventID).maybe.find(person => person === currentUser.id) ? 'filled' : 'border'">Maybe
        </vs-button>
        <vs-button @click="setAttendance([$route.params.eventID, 'declined'])" class="attendance-buttons" color="danger"
                   :type="event($route.params.eventID).declined.find(person => person === currentUser.id) ? 'filled' : 'border'">Declined
        </vs-button>
      </div>
      <br>

      <h4>Description: <span style="font-size: 15px;">{{ event($route.params.eventID).description }}</span></h4>
      <br>
      <div>
        <h1>Attendance</h1>
        <br>
        <hr>
        <h2>Going({{ event($route.params.eventID).going.length }})</h2>
        <br>
        <h4 v-for="attendee in event($route.params.eventID).going" v-bind:key="attendee">
          {{ user(attendee).username }}</h4>
        <br>
        <h2>Maybe({{ event($route.params.eventID).maybe.length }})</h2>
        <br>
        <h4 v-for="maybe in event($route.params.eventID).maybe" v-bind:key="maybe">{{ user(maybe).username }}</h4>
        <br>
        <h2>Declined({{ event($route.params.eventID).declined.length }})</h2>
        <br>
        <h4 v-for="declined in event($route.params.eventID).declined" v-bind:key="declined">
          {{ user(declined).username }}</h4>
      </div>
    </div>
    <div v-else>
      {{ this.$vs.loading.close() }}
      <vs-alert color="danger">Error: Event not found!</vs-alert>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  name: "ViewEventIcebergGaming",
  data(){
    return{
      canUserEdit: false
    }
  },
  methods: {
    ...mapActions(["setAttendance"]),
    checkUser(creator){
      const VALID_ROLES = ["[17th] NCO","[17th] 1st Platoon HQ","[17th] 32nd LSG HQ","[17th] Command","[17th] Officer","[17th] Alpha Company HQ"]
      if(
        this.currentUser.id == creator.id ||
        this.currentUser.roles.some(r => VALID_ROLES.includes(r))
      ){
        this.canUserEdit = true;
      }
    },
  },
  beforeMount(){
    this.checkUser(this.user(this.event(this.$route.params.eventID).creatorID));
  },
  computed: {
    ...mapGetters(["event", "events", "user", "users", "currentUser"])
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchEvents'),
      this.$store.dispatch('fetchUsers'),
    ])
  },
}
</script>

<style>
.attendance-buttons {
  margin-right: 10px !important;
}

</style>
