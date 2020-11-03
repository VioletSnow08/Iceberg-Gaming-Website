<template>
  <div>
    <div v-if="!channels">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Channel..."}) }}</h1>
    </div>
    <div v-else>
      {{this.$vs.loading.close()}}
      <Calendar v-if="channel(channelID) && channel(channelID).isCalendar" />
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Calendar from "./Calendar/Calendar";

export default {
  name: "ViewChannel",
  props: ["channelID"],
  components: {
    Calendar
  },
  computed: {
    ...mapGetters(["channels", "channel"])
  },
  async created () {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
    ])
  },
}
</script>

<style scoped>

</style>
