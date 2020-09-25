<template>
  <div>
    <div class="text-center">
      <h1>Iceberg Gaming Calendar</h1>
      <h2>View the Iceberg Gaming events here!</h2>
    </div>
    <div v-if="events">
      <div class="vx-col w-1/3 items-center sm:flex hidden">
        <!-- Add new event button -->
        <vs-button @click="addEventPopup=true" icon-pack="feather" icon="icon-plus">Add Event</vs-button>
      </div>
      <Calendar v-bind:events="IcebergEvents">{{ this.$vs.loading.close() }}</Calendar>
      <vs-prompt
        class="calendar-event-dialog"
        title="Add Event"
        accept-text="Add Event" :active.sync="addEventPopup">
        <vs-input placeholder="Event Name" v-model="addEvent.name"/>
        <br>
        <div class="vx-row">
          <vs-radio class="radio" v-model="addEvent.type" vs-value="Gaming">Gaming</vs-radio>
          <vs-radio class="radio" v-model="addEvent.type" vs-value="Meeting // Official">Meeting // Official</vs-radio>
        </div>
        <br>
        <div class="my-4">
          <small class="date-label">Start Date</small>
          <datepicker :inline="true" name="start-date" v-model="addEvent.startDate"></datepicker>
        </div>
        <div class="my-4">
          <small class="date-label">End Date</small>
          <datepicker :inline="true" name="end-date" v-model="addEvent.endDate"></datepicker>
        </div>

      </vs-prompt>
    </div>

    <div v-else>
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Events..."}) }}</h1>
    </div>
  </div>

</template>
<script>
import {CalendarView, CalendarViewHeader} from "vue-simple-calendar"
import {mapGetters} from "vuex";
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these. Both are optional, you can create your own theme if you prefer.

require('@/assets/scss/vuexy/apps/simple-calendar.scss')
import Calendar from "@/layouts/components/Calendar";
import Datepicker from 'vuejs-datepicker';

export default {
  name: 'app',
  data() {
    return {
      showDate: new Date(),
      addEventPopup: false,
      addEvent: {
        name: "",

      }
    }
  },
  components: {
    Calendar,
    Datepicker
  },
  methods: {
    setShowDate(d) {
      this.showDate = d;
    },
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchEvents')
    ])
  },
  computed: {
    ...mapGetters(['IcebergEvents', 'events'])
  }
}
</script>

<style>
.radio {
  margin-left: 15px !important;
}
</style>
