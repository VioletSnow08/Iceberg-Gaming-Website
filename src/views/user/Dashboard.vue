<template>
  <div>
    <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
      <statistics-card-line icon="UsersIcon" v-bind:statistic="member.points" statisticTitle="Points"
                            :chart-data="pointsSeries" type="area"></statistics-card-line>
    </div>
  </div>

</template>
<script>
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine";
import {mapGetters} from "vuex";

export default {
  components: {StatisticsCardLine},

  computed: {
    ...mapGetters(["pointsSeries", "member"])
  }
}
</script>

