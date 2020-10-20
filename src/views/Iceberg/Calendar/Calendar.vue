<template>
  <div>
    <div class="text-center">
      <h1>Iceberg Gaming Calendar</h1>
      <p>Please note that ALL times are in UTC</p>
    </div>
    <div class="vx-col w-1/3 items-center sm:flex hidden">
      <vs-button icon-pack="feather" icon="icon-plus" @click="addEventPrompt = true">Add</vs-button>
    </div>
    <br>

    <div v-if="!events">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Calendar Events..."}) }}</h1>
    </div>

    <div v-else id="cal">
      {{this.$vs.loading.close()}}

      <calendar-view
        :show-date="showDate"
        @click-event="viewEventPrompt = true"
        :events="IcebergEvents">
        <calendar-view-header
          slot="header"
          slot-scope="t"
          :header-props="t.headerProps"
          @input="setShowDate"/>
      </calendar-view>
      <!--ADD EVENT-->
      <vs-prompt
        class="calendar-event-dialog"
        title="Add Event"
        accept-text= "Add Event"
        @accept="addNewEvent"
        :active.sync="addEventPrompt">

        <div class="calendar__label-container flex">
          <vs-input name="event-name" class="w-full" label-placeholder="Event Title" v-model="newEvent.title"></vs-input>

          <!--Event Type-->
          <vs-dropdown vs-custom-content vs-trigger-click class="ml-auto my-2 cursor-pointer">
            <feather-icon icon="TagIcon" svgClasses="h-5 w-5" class="cursor-pointer" @click.prevent></feather-icon>
            <vs-dropdown-menu style="z-index: 200001">
              <vs-dropdown-item @click="newEvent.label = 'Other'; newEvent.style='background-color: #3B81BA'">
                <div class="h-3 w-3 inline-block rounded-full mr-2" style="background-color: #3B81BA;"></div>
                <span>Events</span>
              </vs-dropdown-item>

              <vs-dropdown-item @click="newEvent.label = 'Meetings // Official'; newEvent.style='background-color: #8DE2FA'">
                <div class="h-3 w-3 mr-1 inline-block rounded-full mr-2" style="background-color: #8DE2FA;"></div>
                <span>Meetings // Official Events</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>

        </div>
        <div class="my-4">
          <small class="date-label">Start Date</small>
          <datetime value-zone="America/Mexico_City" use12-hour type="datetime" v-model="newEvent.startDate"></datetime>
        </div>
        <div class="my-4">
          <small class="date-label">End Date</small>
          <datetime value-zone="America/Mexico_City" use12-hour type="datetime" v-model="newEvent.endDate"></datetime>
        </div>
      </vs-prompt>
      <!--EDIT EVENT-->
      <vs-prompt
      class="calendar-event-dialog"
      title=""
      accept-text="Save Changes"
      :active.sync="viewEventPrompt">
        <div class="calendar__label-container flex">
          <vs-input name="event-name" class="w-full" label-placeholder="Event Title" v-model="newEvent.title"></vs-input>

          <!--Event Type-->
          <vs-dropdown vs-custom-content vs-trigger-click class="ml-auto my-2 cursor-pointer">
            <feather-icon icon="TagIcon" svgClasses="h-5 w-5" class="cursor-pointer" @click.prevent></feather-icon>
            <vs-dropdown-menu style="z-index: 200001">
              <vs-dropdown-item @click="newEvent.label = 'Other'; newEvent.style='background-color: #3B81BA'">
                <div class="h-3 w-3 inline-block rounded-full mr-2" style="background-color: #3B81BA;"></div>
                <span>Events</span>
              </vs-dropdown-item>

              <vs-dropdown-item @click="newEvent.label = 'Meetings // Official'; newEvent.style='background-color: #8DE2FA'">
                <div class="h-3 w-3 mr-1 inline-block rounded-full mr-2" style="background-color: #8DE2FA;"></div>
                <span>Meetings // Official Events</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>

        </div>
        <div class="my-4">
          <small class="date-label">Start Date</small>
          <datetime value-zone="America/Mexico_City" use12-hour type="datetime" v-model="newEvent.startDate"></datetime>
        </div>
        <div class="my-4">
          <small class="date-label">End Date</small>
          <datetime value-zone="America/Mexico_City" use12-hour type="datetime" v-model="newEvent.endDate"></datetime>
        </div>
      </vs-prompt>
    </div>

  </div>

</template>


<script>
import {CalendarView, CalendarViewHeader} from "vue-simple-calendar"
import { Datetime } from 'vue-datetime';
import "@/assets/scss/vuexy/apps/simple-calendar.scss";
import 'vue-datetime/dist/vue-datetime.css'

import {mapActions, mapGetters} from "vuex";
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these. Both are optional, you can create your own theme if you prefer.
require("vue-simple-calendar/static/css/default.css")
require("vue-simple-calendar/static/css/holidays-us.css")

export default {
  name: 'Calendar',
  data() {
    return {
      showDate: new Date(),
      addEventPrompt: false,
      viewEventPrompt: false,
      newEvent: {
        title: "",
        label: "",
        startDate: "",
        endDate: "",
        division: "Iceberg",
        style: "",
        going: [],
        maybe: [],
        declined: [],
        creatorID: ""
      }
    }
  },
  components: {
    CalendarView,
    CalendarViewHeader,
    Datetime
  },
  methods: {
    setShowDate(d) {
      this.showDate = d;
    },
    viewEvent(event) {
      console.log(event);
    },
    ...mapActions(["addEvent"]),
    addNewEvent() {
      if(this.newEvent.title && this.newEvent.label && this.newEvent.startDate && this.newEvent.endDate) {
        this.addEvent(this.newEvent)
        this.event = {
          title: "",
          label: "",
          startDate: "",
          endDate: "",
          division: "Iceberg",
          style: "",
          going: [],
          maybe: [],
          declined: [],
          creatorID: ""
        };
      } else {
        alert("Error: Missing Field.")
      }
    }
  },
  computed: {
    ...mapGetters(["IcebergEvents", "events", "currentUser"])
  },
  async created () {
    await Promise.all([
      this.$store.dispatch('fetchEvents'),
    ])
  },
}
</script>


<style>
#cal {
  color: white;
  height: 67vh;
}
</style>
