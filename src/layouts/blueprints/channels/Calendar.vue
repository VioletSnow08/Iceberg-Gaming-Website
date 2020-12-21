<template>
  <div>
    <div class="text-center">
      <h1>Now Viewing: {{ channel($route.params.channelID).name }}</h1>
      <p>Channel Division: {{ channel($route.params.channelID).division }}</p>
      <vs-button @click="createEventPopup=true">Create Event</vs-button>
    </div>
    <FullCalendar :options="calendarOptions"/>
    <vs-popup :active.sync="createEventPopup" title="Create Event">
      <vs-input v-model="createEventName" label="Event Name"></vs-input>
      <vs-select label="Event Color" v-model="createEventColor">
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
      <h3 style="text-decoration: underline">Event Details</h3>
      <h4>Name: {{createEventName}}</h4>
      <h4>Color: {{createEventColor}}</h4>
      <h4>Starts At: {{createEventStartDate}}</h4>
      <h4>Ends At: {{createEventEndDate}}</h4>
    </vs-popup>
  </div>

</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {mapGetters} from "vuex";

export default {
  name: 'Calendar',
  props: ['channelID'],
  components: {
    FullCalendar,
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        events: this.$store.getters.events(this.$route.params.channelID),
        height: 950,
        eventClick: function (info) {
          this.onClickedEvent(info);
        }
      },
      createEventPopup: false,
      createEventName: null,
      createEventColor: null,
      createEventStartDate: null,
      createEventEndDate: null
    }
  },
  computed: {
    ...mapGetters(["channel", "events"]),
  },
  methods: {
    onClickedEvent(event) {
      console.log(event);
    }
  }
}
</script>

<style>
* {
  color: white !important;
}
</style>
