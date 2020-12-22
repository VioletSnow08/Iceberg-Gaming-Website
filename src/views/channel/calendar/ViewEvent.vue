<template>
  <div>
    <div v-if="!channels || !users">
      <h1>{{ this.$vs.loading({type: "sound", text: "Loading Event..."}) }}</h1>
    </div>
    <div v-else-if="channel($route.params.channelID) && events && event($route.params.channelID, $route.params.eventID)">
      <div v-if="(channel($route.params.channelID).division.toLowerCase() === 'iceberg' && currentUser.roles.includes('[ICE] Member')) || (channel($route.params.channelID).division.toLowerCase() === '17th' && currentUser.roles.includes('[17th] Member'))">
        {{ this.$vs.loading.close() }}
        <h1 style="text-decoration: underline">Event Details</h1>
        <vx-list
          :list="['Start Time: ' + new Date(event($route.params.channelID, $route.params.eventID).start).toDateString() + ' ' + new Date(event($route.params.channelID, $route.params.eventID).start).toTimeString()]"
          icon="PlayIcon"/>
        <vx-list
          :list="['End Time: ' + new Date(event($route.params.channelID, $route.params.eventID).end).toDateString() + ' ' + new Date(event($route.params.channelID, $route.params.eventID).end).toTimeString()]"
          icon="StopCircleIcon"/>
        <vx-list :list="['Host: ' + user(event($route.params.channelID, $route.params.eventID).userID).username]"
                 icon="UserIcon"/>
        <vs-divider />
        <div v-html="event($route.params.channelID, $route.params.eventID).description"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "ViewEvent",
  computed: {
    ...mapGetters(["channels", "channel", "events", "event", "users", "user", "currentUser"])
  },
  data() {
    return {
      content: ''
    }
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
      this.$store.dispatch('fetchUsers')
    ])
  },

}
</script>

<style scoped>

</style>
