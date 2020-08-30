<template>
<div>
  <h1 v-for="app in applications">{{app.timezone}}</h1>
</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Applications",
  methods: {
    ...mapActions(["setApplications"])
  },
  created() {
    this.setApplications();
  },
  computed: {
    ...mapGetters(["applications"])
  }
}
</script>

<style scoped>

</style>
