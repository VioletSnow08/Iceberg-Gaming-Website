<template>
  <div>
    <div v-if="applications">
      <div id="header">
        <span>{{ this.$vs.loading.close() }}</span>

        <h2 class="text-center">Now Viewing: {{ user($route.params.userID).username }}'s Application</h2>
        <p class="text-center">Current Status:
          {{ application($route.params.userID, $route.params.applicationID).status }}</p>
        <p class="text-center">Division: {{
            application($route.params.userID, $route.params.applicationID).division
          }}</p>
        <div
          v-if="application($route.params.userID, $route.params.applicationID).status.toLowerCase() === 'waiting' || application($route.params.userID, $route.params.applicationID).status.toLowerCase() === 'processing'">
          <vs-button class="appButton" @click="$router.push('/admin/applications')" color="primary">Back</vs-button>
          <vs-button @click="changeApplicationStatus(['Accepted', $route.params.userID, $route.params.applicationID, (application($route.params.userID, $route.params.applicationID).division)])"
                     class="appButton" color="success" type="filled">Accept
          </vs-button>
          <vs-button @click="changeApplicationStatus(['Denied', $route.params.userID, $route.params.applicationID, (application($route.params.userID, $route.params.applicationID).division)])"
                     class="appButton" color="danger" type="filled">Decline
          </vs-button>
          <vs-button @click="changeApplicationStatus(['Processing', $route.params.userID, $route.params.applicationID, (application($route.params.userID, $route.params.applicationID).division)])"
                     class="appButton" color="warning" type="filled">Process
          </vs-button>
        </div> <!-- If it is accepted or denied -->
        <div v-else>
          <vs-button class="appButton" @click="$router.push('/admin/applications')" color="primary">Back</vs-button>
          <vs-button class="appButton" disabled color="success" type="filled">Accept</vs-button>
          <vs-button class="appButton" disabled color="danger" type="filled">Deny</vs-button>
          <vs-button class="appButton" disabled color="warning" type="filled">Process</vs-button>
        </div>
      </div>
      <ApplicationBP17th v-if="application($route.params.userID, $route.params.applicationID).division === '17th'" v-bind:application="application($route.params.userID, $route.params.applicationID)"/>
      <ApplicationBPIceberg v-if="application($route.params.userID, $route.params.applicationID).division === 'Iceberg'" v-bind:application="application($route.params.userID, $route.params.applicationID)"/>


    </div>
    <div v-else>
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Application..."}) }}</h1>
    </div>

  </div>

</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import ApplicationBP17th from "@/layouts/applications/17th";
import ApplicationBPIceberg from "@/layouts/applications/Iceberg";

export default {
  name: 'Applications',
  methods: {
    ...mapActions(["changeApplicationStatus"])
  },
  components: {
    ApplicationBP17th,
    ApplicationBPIceberg
  },
  computed: {
    ...mapGetters(['application', 'user', 'applications'])
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchApplications'),
      this.$store.dispatch('fetchUsers')
    ])
  },
  data() {
    return {
      confirmPopup: false,
    }
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
