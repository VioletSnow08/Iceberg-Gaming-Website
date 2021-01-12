<template>
  <div>
    <div v-if="!users">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading The Hub..."}) }}</h1>
    </div>
    <div v-else-if="users">
      {{this.$vs.loading.close()}}
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
          <statistics-card-line
            hideChart
            class="mb-base"
            icon="EyeIcon"
            icon-right
            statistic="LOA Status"
            :statisticTitle="isUserOnLOA([currentUser.id]) ? 'On LOA' : 'Not on LOA'"/>
        </div>
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
    ...mapGetters(["currentUser", "isUserOnLOA", "users"])
  },
  components: {
    StatisticsCardLine
  },
  async created () {
    await Promise.all([
      this.$store.dispatch('fetchUsers')
    ])
  }
}
</script>

<style scoped>

</style>
