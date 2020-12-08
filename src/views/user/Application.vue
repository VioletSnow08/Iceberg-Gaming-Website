<template>
  <div>
    <div v-if="!applications || !users">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Applications..."}) }}</h1>
    </div>
    <div v-else-if="application(currentUser.id, $route.params.applicationID)">
      {{ this.$vs.loading.close() }}
      <div class="text-center">
        <h2>Now Viewing Your Application</h2>
        <p>Current Status: {{ application(currentUser.id, $route.params.applicationID).status }}</p>
        <p>Division: {{ applicationDivisionDisplay(application(currentUser.id, $route.params.applicationID).division) }}</p>
      </div>
      <vs-button @click="$router.push('/applications')">Back</vs-button>
      <ApplicationBP17th v-if="application(currentUser.id, $route.params.applicationID).division === '17th'" v-bind:application="application(currentUser.id, $route.params.applicationID)"/>
      <ApplicationBPIceberg v-if="application(currentUser.id, $route.params.applicationID).division === 'Iceberg'" v-bind:application="application(currentUser.id, $route.params.applicationID)"/>
    </div>
    <div v-else>
      {{ this.$vs.loading.close() }}
      <vs-alert color="danger">Error: Application not found!</vs-alert>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import ApplicationBP17th from "../../layouts/applications/17th.vue";
import ApplicationBPIceberg from "../../layouts/applications/Iceberg.vue";
import {applicationDivisionDisplay} from "../../../utils";

export default {
  name: 'Application',
  methods: {
    applicationDivisionDisplay
  },
  computed: {
    ...mapGetters(['application', 'applications', 'currentUser', 'users'])
  },
  components: {
    ApplicationBP17th,
    ApplicationBPIceberg
  },
  data() {
    return {
      confirmPopup: false,
    }
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchApplications'),
      this.$store.dispatch('fetchUsers')
    ])
  }
}
</script>

<style scoped>
.answer {
  color: #10163A;
}

.appButton {
  margin-right: 20px;
}
</style>
