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
          :list="['Title: ' + event($route.params.channelID, $route.params.eventID).title]"
          icon="TypeIcon"/>
        <vx-list
          :list="['Start Time: ' + new Date(event($route.params.channelID, $route.params.eventID).start).toDateString() + ' ' + new Date(event($route.params.channelID, $route.params.eventID).start).toTimeString()]"
          icon="PlayIcon"/>
        <vx-list
          :list="['End Time: ' + new Date(event($route.params.channelID, $route.params.eventID).end).toDateString() + ' ' + new Date(event($route.params.channelID, $route.params.eventID).end).toTimeString()]"
          icon="StopCircleIcon"/>
        <vx-list :list="['Host: ' + user(event($route.params.channelID, $route.params.eventID).userID).username]"
                 icon="UserIcon"/>
        <div class="vx-row">
          <vs-button
            :disabled="(currentUser.id !== event($route.params.channelID, $route.params.eventID).userID) ? true : false"
            style="margin: 0 20px" @click="isEditPopupOpen=true" icon="edit" color="warning">Edit Event
          </vs-button>
          <vs-button
            :disabled="(currentUser.id !== event($route.params.channelID, $route.params.eventID).userID) ? true : false"
            @click="isDeletePopupOpen=true" icon="delete" color="danger">Delete Event
          </vs-button>
        </div>

        <vs-divider/>
        <div v-html="event($route.params.channelID, $route.params.eventID).description"></div>
        <vs-divider/>


        <vs-table :data="attendees">
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

        <vs-popup :active.sync="isDeletePopupOpen" title="Are you sure you want to delete this?"><p>Deleting this is
          permanent and non-recoverable.</p>
          <vs-button
            @click="deleteEvent([$route.params.channelID, $route.params.eventID]); isDeletePopupOpen=false; $router.push('/channels/' + $route.params.channelID)">
            Delete Event
          </vs-button>
        </vs-popup>

        <vs-popup fullscreen :active.sync="isEditPopupOpen" title="Edit Event">
          <vs-input :placeholder="event($route.params.channelID, $route.params.eventID).title" v-model="newEventTitle" label="Event Name"></vs-input>
          <vs-select label="Event Color" v-model="newEventColor">
            <div v-if="channel($route.params.channelID).division === 'iceberg'">
              <vs-select-item value="#3B81BA" text="Dark Blue"></vs-select-item>
              <vs-select-item value="#8DE2FA" text="Light Blue"></vs-select-item>
            </div>
            <div v-else-if="channel($route.params.channelID).division === '17th'">
              <vs-select-item value="#72A0C1" text="Gray"></vs-select-item>
              <vs-select-item value="#D40000" text="Red"></vs-select-item>
              <vs-select-item value="#014421" text="Dark Green"></vs-select-item>
              <vs-select-item value="#EEE600" text="Yellow"></vs-select-item>
              <vs-select-item value="#1164B4" text="Blue"></vs-select-item>
              <vs-select-item value="#4C2882" text="Purple"></vs-select-item>
            </div>
          </vs-select>
          <br>
          <flat-pickr :config="configdateTimePicker" v-model="newEventStartDate" placeholder="Start Date & Time"/>
          <br>
          <br>
          <flat-pickr :config="configdateTimePicker" v-model="newEventEndDate" placeholder="End Date & Time"/>
          <br>
          <br>
          <p>Event Description</p>
          <quill-editor v-model="newEventDescription" :options="quillOptions"/>
          <br>
          <vs-button
            @click="editEvent([$route.params.channelID, newEventStartDate, newEventEndDate, newEventColor, newEventTitle, newEventDescription, $route.params.eventID]); isEditPopupOpen=false; sendNotification()">
            Create Event
          </vs-button>
        </vs-popup>

      </div>
      <div v-else>
        {{ this.$vs.loading.close() }}
        <vs-alert color="danger">Error: Invalid Permissions!</vs-alert>
      </div>
    </div>
    <div v-else>
      {{ this.$vs.loading.close() }}
      <vs-alert color="danger">Error: Channel/Event not found!</vs-alert>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
  name: "ViewEvent",
  components: {
    flatPickr
  },
  computed: {
    ...mapGetters(["channels", "channel", "events", "event", "users", "user", "currentUser"])
  },
  data() {
    return {
      content: '',
      attendees: [],
      isDeletePopupOpen: false,
      isEditPopupOpen: false,
      newEventColor: null,
      newEventStartDate: null,
      newEventEndDate: null,
      newEventTitle: null,
      newEventDescription: null,
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Z'
      },
      quillOptions: {
        modules: {
          toolbar: [['bold', 'italic', 'code', 'strike', 'underline'], [{'header' : 1}, { 'header': 2}, {'list': 'ordered'}, {'list': 'bullet'}, 'align',], [{'header': [1, 2, 3, 4, 5, 6, false]}]]
        }
      }
    }
  },
  methods: {
    ...mapActions(["deleteEvent", "editEvent"]),
    getStateColor(status) {
      if (status.toLowerCase() === "going") {
        return "success";
      } else if (status.toLowerCase() === "maybe") {
        return "warning"
      } else if (status.toLowerCase() === "declined") {
        return "danger";
      }
    },
    sendNotification() {
      this.$vs.notify({
        title: 'Event Edited',
        text: 'In order to see the edited event, you may need to refresh your page. Sorry! Have fun at the event :)',
        color: 'success',
        time: 4000
      })
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
        if (this.channel(this.$route.params.channelID)) {
          if (this.channel(this.$route.params.channelID).events) {
            if (this.event(this.$route.params.channelID, this.$route.params.eventID)) {
              let event = this.event(this.$route.params.channelID, this.$route.params.eventID);
              this.attendees = event.attendance;
              this.newEventColor = event.color;
              this.newEventStartDate = event.start;
              this.newEventEndDate = event.end;
              this.newEventTitle = event.title;
              this.newEventDescription = event.description;

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
