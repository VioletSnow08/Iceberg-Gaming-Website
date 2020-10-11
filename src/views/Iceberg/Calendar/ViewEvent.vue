<template>
<div>
  <div v-if="!events || !users">
    <h1>{{ this.$vs.loading({type: "radius", text: "Loading Event..."}) }}</h1>
  </div>
  <div v-else-if="IcebergEvent($route.params.eventID) && users">
    {{this.$vs.loading.close()}}
    <h1>{{IcebergEvent($route.params.eventID).title}}</h1>
    <h2>Hosted by: {{user(IcebergEvent($route.params.eventID).creatorID).username}}</h2>
    <h4>Going: {{IcebergEvent($route.params.eventID).going.length}}</h4>
    <h4>Maybe: {{IcebergEvent($route.params.eventID).maybe.length}}</h4>
    <h4>Declined: {{IcebergEvent($route.params.eventID).declined.length}}</h4>
    <br>
    <hr>
    <div>
      <h1>Attendance</h1>
      <br>
      <hr>
      <h2>Going({{IcebergEvent($route.params.eventID).going.length}})</h2>
      <br>
      <h4 v-for="attendee in IcebergEvent($route.params.eventID).going" v-bind:key="attendee">{{user(attendee).username}}</h4>
      <br>
      <h2>Maybe({{IcebergEvent($route.params.eventID).maybe.length}})</h2>
      <br>
      <h4 v-for="maybe in IcebergEvent($route.params.eventID).maybe" v-bind:key="maybe">{{user(maybe).username}}</h4>
      <br>
      <h2>Declined({{IcebergEvent($route.params.eventID).declined.length}})</h2>
      <br>
      <h4 v-for="declined in IcebergEvent($route.params.eventID).declined" v-bind:key="declined">{{user(declined).username}}</h4>
      </div>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: "ViewEventIcebergGaming",
    computed: {
        ...mapGetters(["IcebergEvent", "events", "user", "users"])
    },
  async created () {
    await Promise.all([
      this.$store.dispatch('fetchEvents'),
      this.$store.dispatch('fetchUsers'),
    ])
  },
}
</script>

<style>

</style>
