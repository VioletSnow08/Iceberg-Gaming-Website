<template>
  <div>
    <div v-if="!channels || !users">
      <h1>{{ this.$vs.loading({type: "sound", text: "Loading Event..."}) }}</h1>
    </div>
    <div
      v-else-if="channel($route.params.channelID) && events && event($route.params.channelID, $route.params.eventID)">
      <div
        v-if="(channel($route.params.channelID).division.toLowerCase() === 'iceberg' && currentUser.roles.includes('[ICE] Member')) || (channel($route.params.channelID).division.toLowerCase() === '17th' && currentUser.roles.includes('[17th] Member'))">
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
        <vs-divider/>
        <div v-html="event($route.params.channelID, $route.params.eventID).description"></div>
        <vs-divider/>


        <vs-table :search="true" :data="attendees">
          <template slot="header"><h3>Attendance</h3></template>

          <template slot="thead">
            <vs-th sort-key="username">Username</vs-th>
            <vs-th sort-key="status">Status</vs-th>
          </template>
            <vs-tr :key="index"
                   :state="getStateColor(attendee.status)" v-for="(attendee, index) in attendees">
              <vs-td>{{ user(attendee.userID).username }}</vs-td>
              <vs-td>{{ attendee.status }}</vs-td>
            </vs-tr>
        </vs-table>
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
      content: '',
      attendees: []
    }
  },
  methods: {
    getStateColor(status) {
      if (status.toLowerCase() === "going") {
        return "success";
      } else if (status.toLowerCase() === "maybe") {
        return "warning"
      } else if (status.toLowerCase() === "declined") {
        return "danger";
      }
    }
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
      this.$store.dispatch('fetchUsers')
    ])
  },
  watch: {
    channels: function () {
      if (this.channels) {
        console.log(1);
        if (this.channel(this.$route.params.channelID)) {
          console.log(2);
          if (this.channel(this.$route.params.channelID).events) {
            console.log(3);
            if (this.event(this.$route.params.channelID, this.$route.params.eventID)) {
              this.attendees = this.event(this.$route.params.channelID, this.$route.params.eventID).attendance
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
