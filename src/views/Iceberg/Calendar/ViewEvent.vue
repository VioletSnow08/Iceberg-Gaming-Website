<template>
<div>
  <div v-if="!events">
    <h1>{{ this.$vs.loading({type: "radius", text: "Loading Calendar Events..."}) }}</h1>
  </div>

  <div v-else>
    {{this.$vs.loading.close()}}
    <h1>test</h1>
    <h2>{{IcebergEvent($route.params.eventID).title}}</h2>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: "ViewEventIcebergGaming",
    computed: {
        ...mapGetters(["IcebergEvent", "events"])
    },
  async created () {
    await Promise.all([
      this.$store.dispatch('fetchEvents'),
    ])
  },
}
</script>

<style>

</style>
