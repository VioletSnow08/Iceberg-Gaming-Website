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
        <br>
        <vs-button @click="createChannelPopup=true">Create Channel</vs-button>
      </div>
      <h3 style="text-decoration: underline">Channels you can manage</h3>



      <vs-list v-if="currentUser.roles.some(r => ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster'].includes(r))">
        <vs-list-header color="teal" title="Iceberg Gaming"></vs-list-header>
        <div v-for="channel in channels">
          <vs-list-item v-if="channel.division.toLowerCase() === 'iceberg'" :title="channel.name" :icon="getChannelIcon(channel.type)">
            <vs-button @click="editChannelPopup=true; editedChannelID=channel.id" class="padButton" color="warning">Edit</vs-button>
            <vs-button @click="deleteChannelPopup=true; deleteChannelID=channel.id" class="padButton" color="danger">Delete</vs-button>
          </vs-list-item>
        </div>
      </vs-list>



      <vs-list
        v-if="currentUser.roles.some(r => ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster', '[17th] Alpha Company HQ', '[17th] Officer'].includes(r))">
        <vs-list-header color="brown" title="17th Brigade Combat Team"></vs-list-header>
        <div v-for="channel in channels">
          <vs-list-item v-if="channel.division.toLowerCase() === '17th'" :icon="getChannelIcon(channel.type)"
                        :title="channel.name">
            <vs-button @click="editChannelPopup=true; editedChannelID=channel.id" class="padButton" color="warning">Edit</vs-button>
            <vs-button @click="deleteChannelPopup=true; deleteChannelID=channel.id" class="padButton" color="danger">Delete</vs-button>
          </vs-list-item>
        </div>
      </vs-list>



      <vs-list
        v-if="currentUser.roles.some(r => ['[ICE] Owner', '[ICE] Admin', '[ICE] Webmaster', '[CGS] Owner'].includes(r))">
        <vs-list-header color="black" title="Chryse Guard Security"></vs-list-header>
        <div v-for="channel in channels">
          <vs-list-item v-if="channel.division.toLowerCase() === 'cgs'" :title="channel.name" :icon="getChannelIcon(channel.type)">
            <vs-button @click="editChannelPopup=true; editedChannelID=channel.id" class="padButton" color="warning">Edit</vs-button>
            <vs-button @click="deleteChannelPopup=true; deleteChannelID=channel.id" class="padButton" color="danger">Delete</vs-button>
          </vs-list-item>
        </div>
      </vs-list>

<!--      Create channel Popup      -->

      <vs-popup :active.sync="createChannelPopup" title="Test">
        <div class="vx-row">
          <vs-select style="margin: 0 15px;" label="Please select a division." v-model="newChannelDivision">
            <vs-select-item v-for="d in newChannelDivisions" :value="d" :text="d"/>
          </vs-select>

          <vs-select label="Please select a channel type." v-model="newChannelType">
            <vs-select-item v-for="t in newChannelTypes" :value="t" :text="t"/>
          </vs-select>
        </div>

        <vs-input label="Please enter a channel name." v-model="newChannelName"></vs-input>
        <br>
        <vs-button @click="createChannel([newChannelName, newChannelType, newChannelDivision]); setNotification(); createChannelPopup=false">Submit</vs-button>
      </vs-popup>

<!--      Edit channel Popup      -->
      <vs-popup :active.sync="editChannelPopup" title="Test">
        <vs-input v-if="editChannelPopup" label="Please enter a new channel name." :placeholder="channel(editedChannelID).name" v-model="editedChannelName"></vs-input>
        <br>
        <vs-button @click="editChannel([editedChannelName, editedChannelID]); editChannelPopup=false; editedChannelName=''">Submit</vs-button>
      </vs-popup>

      <!--      Delete channel Popup      -->
      <vs-popup :active.sync="deleteChannelPopup" title="Are you sure you want to delete this channel?">
        <vs-button @click="deleteChannel(deleteChannelID); deleteChannelPopup=false;" color="danger">Delete Channel</vs-button>
      </vs-popup>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

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
      if (type === "calendar") {
        return "calendar_today";
      } else if (type === "forum") {
        return "forum";
      } else if(type === "documents") {
        return "description"
      }
    },
    setNotification() {
      this.$vs.notify({
        title: 'Channel Created',
        text: 'Use the navigation bar to view your new channel!',
        time: 4000
      })
    },
    ...mapActions(["createChannel", "editChannel", "deleteChannel"])
  },
  data() {
    return {
      createChannelPopup: false,
      editChannelPopup: false,
      deleteChannelPopup: false,
      deleteChannelID: null,
      editedChannelID: null,
      editedChannelName: '',
      newChannelName: '',
      newChannelType: 'Calendar',
      newChannelTypes: ['Calendar', 'Forum', 'Documents'],
      newChannelDivision: 'Iceberg',
      newChannelDivisions: ['Iceberg', '17th', 'CGS']
    }
  }
}
</script>

<style scoped>
.padButton {
  margin-right: 5px;
}

.hov {
  cursor: pointer;
}
</style>
