<template>
  <div>
    <div v-if="!channels || !users">
      <h1>{{ this.$vs.loading({type: "sound", text: "Loading Channels..."}) }}</h1>
    </div>
    <div v-else-if="channel($route.params.channelID) && channel($route.params.channelID).division.toLowerCase() === 'iceberg'">
      {{ this.$vs.loading.close() }}
      <h1>ICEBERG</h1>
    </div>
    <div v-else-if="channel($route.params.channelID) && channel($route.params.channelID).division.toLowerCase() === '17th'">
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
import CalendarBP from "@/layouts/blueprints/channels/Calendar"
export default {
  name: "Channel",
  computed: {
    ...mapGetters(["channels", "channel", "users"])
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
