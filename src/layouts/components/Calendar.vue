<template>
  <div class="cal">
    <br>
    <calendar-view
      :show-date="showDate"
      :events="events"
      class="theme-default holiday-us-traditional holiday-us-official">

      <calendar-view-header
        slot="header"
        slot-scope="t"
        :header-props="t.headerProps"
        @input="setShowDate"/>

    </calendar-view>
  </div>

</template>
<script>
import {CalendarView, CalendarViewHeader} from "vue-simple-calendar"
import {mapGetters} from "vuex";
// The next two lines are processed by webpack. If you're using the component without webpack compilation,
// you should just create <link> elements for these. Both are optional, you can create your own theme if you prefer.

require('@/assets/scss/vuexy/apps/simple-calendar.scss')

export default {
  name: 'app',
  props: ['events'],
  data() {
    return {
      showDate: new Date()
    }
  },
  components: {
    CalendarView,
    CalendarViewHeader,
  },
  methods: {
    setShowDate(d) {
      this.showDate = d;
    },
  },

}
</script>
<style>
.cal {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  height: 67vh;
  margin-left: auto;
  margin-right: auto;
}
</style>
