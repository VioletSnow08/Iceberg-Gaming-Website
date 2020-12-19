<template>
  <div>
    <div v-if="!disciplinaryActionForms || !users">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Disciplinary Action Forms..."}) }}</h1>
    </div>

    <div v-else>
      {{ this.$vs.loading.close() }}
      <h1 class="text-center">Disciplinary Action Forms</h1>
      <h2 class="text-center">Review and <span style="font-weight: bold">punish</span> people here!</h2>
      <br>
      <div class="vx-row">
        <div v-for="form in disciplinaryActionForms" v-bind:key="form.id" class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base">
          <vx-card :title="user(form.userID).username" :subtitle="'Offender: ' + form.offender" class="p-2">
            <div class="text-center">
              <vs-chip :color="form.comment ? 'success' : 'danger'">{{ form.comment ? 'Reviewed': 'Awaiting Review' }}</vs-chip>
            </div>
            <vs-button @click="" type="gradient"
                       class="w-full mt-6" color="#FF0099" @click="viewDisciplinaryActionForm(form.id)" gradient-color-secondary="#493240">View Disciplinary Action Form</vs-button>
          </vx-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {applicationDivisionDisplay} from "../../../../../utils";

export default {
  name: 'Applications',
  methods: {
    viewDisciplinaryActionForm(formID) {
      this.$router.push({name: 'ViewDisciplinaryActionForm', params: {formID}})
    },
  },
  computed: {
    ...mapGetters(['disciplinaryActionForms', 'currentUser', 'user', 'users']),
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchDisciplinaryActionForms'),
      this.$store.dispatch('fetchUsers')
    ])
  }
}
</script>

<style scoped>

</style>
