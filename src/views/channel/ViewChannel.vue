<template>
  <div>
    <div v-if="!channels || !users">
      <h1>{{ this.$vs.loading({type: "sound", text: "Loading Channels..."}) }}</h1>
    </div>
    <div v-else-if="channel($route.params.channelID) && channel($route.params.channelID).division.toLowerCase() === 'iceberg' && currentUser.roles.includes('[ICE] Member')">
      {{ this.$vs.loading.close() }}
      <CalendarBP v-bind:channelID="$route.params.channelID" :key="$route.params.channelID"></CalendarBP>
    </div>
    <div v-else-if="channel($route.params.channelID) && channel($route.params.channelID).division.toLowerCase() === '17th' && currentUser.roles.includes('[17th] Member')">
      {{ this.$vs.loading.close() }}
      <CalendarBP v-bind:channelID="$route.params.channelID" :key="$route.params.channelID"></CalendarBP>
    </div>
    <div v-else>
      {{ this.$vs.loading.close() }}
      <vs-alert color="danger">Error: Channel Not Found!</vs-alert>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import CalendarBP from "@/views/channel/calendar/Calendar"
export default {
  name: "Channel",
  computed: {
    ...mapGetters(["channels", "channel", "users", "currentUser"])
  },
  components: {
    CalendarBP
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
      this.$store.dispatch('fetchUsers')
    ])
  }
}
</script>

<style scoped>

</style>
