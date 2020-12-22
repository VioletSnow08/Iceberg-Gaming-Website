<template>
  <div>
    <div class="text-center">
      <h1>Now Viewing: {{ channel($route.params.channelID).name }}</h1>
      <p>Channel Division: {{ channel($route.params.channelID).division }}</p>
      <vs-button @click="createEventPopup=true">Create Event</vs-button>
    </div>
    <FullCalendar :options="calendarOptions"/>
    <vs-popup fullscreen :active.sync="createEventPopup" title="Create Event">
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
      <flat-pickr :config="configdateTimePicker" v-model="createEventStartDate" placeholder="Start Date & Time"/>
      <br>
      <br>
      <flat-pickr :config="configdateTimePicker" v-model="createEventEndDate" placeholder="End Date & Time"/>
      <br>
      <br>
      <p>Event Description</p>
      <quill-editor v-model="createEventDescription" :options="quillOptions"/>
      <br>
      <vs-button
        @click="createEvent([$route.params.channelID, createEventStartDate, createEventEndDate, createEventColor, createEventName, createEventDescription]); createEventPopup=false; sendNotification()">
        Create Event
      </vs-button>
    </vs-popup>
  </div>

</template>
<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import {mapActions, mapGetters} from "vuex";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
  name: 'Calendar',
  props: ['channelID'],
  components: {
    FullCalendar,
    flatPickr
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
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Z'
      },
      createEventPopup: false,
      createEventName: null,
      createEventColor: null,
      createEventStartDate: null,
      createEventEndDate: null,
      createEventDescription: '',
      quillOptions: {
        modules: {
          toolbar: [['bold', 'italic', 'code', 'strike', 'underline'], [{'header' : 1}, { 'header': 2}, {'list': 'ordered'}, {'list': 'bullet'}, 'align',], [{'header': [1, 2, 3, 4, 5, 6, false]}]]
        }
      }
    }
  },
  computed: {
    ...mapGetters(["channel", "events"]),
  },
  methods: {
    onClickedEvent(event) {
      console.log(event);
    },
    sendNotification() {
      this.$vs.notify({
        title: 'Event Created',
        text: 'In order to see the event, you need to refresh your page. Sorry! Have fun at the event :)',
        color: 'success',
        time: 4000
      })
    },
    ...mapActions(["createEvent"])
  }
}
</script>

<style>
* {
  color: white !important;
}
</style>
