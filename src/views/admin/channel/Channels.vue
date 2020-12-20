<template>
  <div>
    <div v-if="!channels">
      <h1>{{ this.$vs.loading({type: "sound", text: "Loading Channels..."}) }}</h1>
    </div>
    <div v-else-if="channels">
      <span>{{ this.$vs.loading.close() }}</span>
      <div class="text-center">
        <h1>Channel Management</h1>
        <h2>Manage and Create channels here.</h2>
        <p>All channels that are created are public to the division it was created for.</p>
      </div>
      <h3 style="text-decoration: underline">Channels you can manage</h3>
      <vs-list v-if="currentUser.roles.some(r => ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster'].includes(r))">
        <vs-list-header color="teal" title="Iceberg Gaming"></vs-list-header>
        <div v-for="channel in channels">
          <vs-list-item v-if="channel.division.toLowerCase() === 'iceberg'" :title="channel.name">
            <vs-button class="padButton" color="warning">Edit</vs-button>
            <vs-button class="padButton" color="danger">Delete</vs-button>
          </vs-list-item>
        </div>
      </vs-list>

      <vs-list
        v-if="currentUser.roles.some(r => ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster', '[17th] Alpha Company HQ', '[17th] Officer'].includes(r))">
        <vs-list-header color="brown" title="17th Brigade Combat Team"></vs-list-header>
        <div v-for="channel in channels">
          <vs-list-item v-if="channel.division.toLowerCase() === '17th'" :icon="getChannelIcon(channel.type)" :title="channel.name">
            <vs-button class="padButton" color="warning">Edit</vs-button>
            <vs-button class="padButton" color="danger">Delete</vs-button>
          </vs-list-item>
        </div>
      </vs-list>

      <vs-list
        v-if="currentUser.roles.some(r => ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster', '[CGS] Owner'].includes(r))">
        <vs-list-header color="black" title="Chryse Guard Security"></vs-list-header>
        <div v-for="channel in channels">
          <vs-list-item v-if="channel.division.toLowerCase() === 'cgs'" :title="channel.name">
            <vs-button class="padButton" color="warning">Edit</vs-button>
            <vs-button class="padButton" color="danger">Delete</vs-button>
          </vs-list-item>
        </div>
      </vs-list>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Channels",
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
      this.$store.dispatch('fetchUsers')
    ])
  },
  computed: {
    ...mapGetters(["channels", "channel", "currentUser"])
  },
  methods: {
    getChannelIcon(type) {
      type = type.toLowerCase();
      console.log(type);
      if(type === "calendar") {
        return "calendar_today";
      } else if(type === "forum") {
        return "forum";
      }
    }
  }
}
</script>

<style scoped>
.padButton {
  margin-right: 5px;
}
</style>
