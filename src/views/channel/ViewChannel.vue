<template>
  <div>
    <div v-if="!channels || !users">
      <h1>{{ this.$vs.loading({type: "sound", text: "Loading Channels..."}) }}</h1>
    </div>
    <div v-else-if="channel($route.params.channelID) && channel($route.params.channelID).division.toLowerCase() === 'iceberg' && currentUser.roles.includes('[ICE] Member')">
      {{ this.$vs.loading.close() }}
      <div class="text-center">
        <h1>Now Viewing: {{ channel($route.params.channelID).name }}</h1>
        <p>Channel Division: {{ channel($route.params.channelID).division }}</p>
        </div>
      <CalendarBP v-if="channel($route.params.channelID).type === 'calendar'" v-bind:channelID="$route.params.channelID" :key="$route.params.channelID"></CalendarBP>
      <DocumentsBP v-if="channel($route.params.channelID).type === 'documents'" v-bind:channelID="$route.params.channelID" :key="$route.params.channelID"></DocumentsBP>
    </div>
    <div v-else-if="channel($route.params.channelID) && channel($route.params.channelID).division.toLowerCase() === '17th' && currentUser.roles.includes('[17th] Member')">
      {{ this.$vs.loading.close() }}
      <div class="text-center">
        <h1>Now Viewing: {{ channel($route.params.channelID).name }}</h1>
        <p>Channel Division: {{ channel($route.params.channelID).division }}</p>
      </div>
      <CalendarBP v-if="channel($route.params.channelID).type === 'calendar'" v-bind:channelID="$route.params.channelID" :key="$route.params.channelID"></CalendarBP>
      <DocumentsBP v-if="channel($route.params.channelID).type === 'documents'" v-bind:channelID="$route.params.channelID" :key="$route.params.channelID"></DocumentsBP>
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
import DocumentsBP from "@/views/channel/documents/Documents";


export default {
  name: "Channel",
  computed: {
    ...mapGetters(["channels", "channel", "users", "currentUser"])
  },
  components: {
    CalendarBP,
    DocumentsBP
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
