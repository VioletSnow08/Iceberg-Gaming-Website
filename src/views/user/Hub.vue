<template>
  <div>
    <div class="text-center">
      <h1>Welcome to the Iceberg Gaming Hub!</h1>
      <h2>Enjoy your stay!</h2>
    </div>
    <br>
    <!--    Row 2 - Iceberg Gaming Related-->
    <div v-if="currentUser.roles.includes('[ICE] Member')" class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="CoffeeIcon"
          icon-right
          :statisticTitle="currentUser.status"
          statistic="Current Status"/>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4">
        <vx-tooltip text="Click to Toggle Loa Status">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="EyeIcon"
            icon-right
            :statistic="currentUser.onLOA ? 'On LOA' : 'Not on LOA'"
            statisticTitle="LOA Status"/>
        </vx-tooltip>
      </div>
    </div>

    <!--    Row 2 - 17th Brigade Combat Team Related-->
    <div v-if="currentUser.roles.includes('[17th] Member')" class="vx-row">
      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="CheckIcon"
          :statistic="currentUser.bct_rank"
          statisticTitle="17th - Current Rank"/>
      </div>
      <div v-if="currentUser.bct_eligibleForPromotion" class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <vx-tooltip text="You are eligible for promotion!">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="ChevronsUpIcon"
            color="success"
            :statistic="currentUser.bct_points"
            statisticTitle="17th - Points"/>
        </vx-tooltip>
      </div>
      <div v-else-if="currentUser.bct_eligibleForDemotion" class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <vx-tooltip text="You are eligible for demotion!">
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="ChevronsDownIcon"
            color="danger"
            :statistic="currentUser.bct_points"
            statisticTitle="17th - Points"/>
        </vx-tooltip>
      </div>
      <div v-else class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="CheckIcon"
          :statistic="currentUser.bct_points"
          statisticTitle="17th - Points"/>
      </div>
      <div class="vx-col w-1/2 md:w-1/3 xl:w-1/6">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="CheckSquareIcon"
          :statistic="currentUser.bct_events_attended"
          statisticTitle="17th - Events Attended"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'

export default {
  name: "Hub",
  computed: {
    ...mapGetters(["currentUser"])
  },
  components: {
    StatisticsCardLine
  }
}
</script>

<style scoped>

</style>
