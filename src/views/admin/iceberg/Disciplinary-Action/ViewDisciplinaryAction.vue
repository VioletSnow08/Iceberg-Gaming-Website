<template>
  <div>
    <div v-if="!disciplinaryActionForms || !users">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Application..."}) }}</h1>
    </div>


    <div v-else-if="disciplinaryActionForms && users">
      <div v-if="disciplinaryActionForm($route.params.formID) && user(disciplinaryActionForm($route.params.formID).userID)">
        <div id="header">
          <span>{{ this.$vs.loading.close() }}</span>
          <h2 class="text-center">Now Viewing: {{ user(disciplinaryActionForm($route.params.formID).userID).username }}'s Disciplinary Action Report</h2>
          <p class="text-center">Current Status: {{disciplinaryActionForm($route.params.formID).comment ? 'Reviewed' : 'Awaiting Review'}}</p>
          <p v-if="disciplinaryActionForm($route.params.formID).comment" class="text-center">Reviewed By: {{user(disciplinaryActionForm($route.params.formID).userID).username}}</p>
          <br>
          <vs-button @click="isPromptOpen=true" class="appButton" :disabled="disciplinaryActionForm($route.params.formID).comment ? true : false" color="warning">Mark as Reviewed(prompt)</vs-button>
        </div>

        <vs-popup :active.sync="isPromptOpen" title="Mark as Reviewed">
          <vs-input v-model="newPunishment" label="What punishment did you give? If none then leave blank"></vs-input>
          <br>
          <vs-textarea v-model="newComment" label="Why did you give that punishment? If you didn't give a punishment, please explain why."></vs-textarea>
          <br>
          <vs-button @click="submitForm()">Submit</vs-button>
        </vs-popup>
        <br>
        <h2>Comments:</h2>
        <p v-if="disciplinaryActionForm($route.params.formID).comment">{{disciplinaryActionForm($route.params.formID).comment}}</p>
        <ViewDisciplinaryActionBP v-bind:form="disciplinaryActionForm($route.params.formID)" />



      </div>
      <div v-else>
        <span>{{ this.$vs.loading.close() }}</span>
        <vs-alert color="danger">Error: User and/or Disciplinary Action Form not found!</vs-alert>
      </div>
    </div>
  </div>

</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import ViewDisciplinaryActionBP from "@/layouts/DisciplinaryAction";


export default {
  name: 'ViewDisciplinaryAction',
  methods: {
    ...mapActions(['submitDisciplinaryActionReview']),
    submitForm() {
      if(this.newComment) {
        this.submitDisciplinaryActionReview([this.newPunishment, this.newComment, this.$route.params.formID]);
      } else {
        alert("Please provide a comment!");
      }
    }
  },
  components: {
    ViewDisciplinaryActionBP
  },
  computed: {
    ...mapGetters(['disciplinaryActionForms', 'user', 'disciplinaryActionForm', 'users', 'currentUser'])
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchDisciplinaryActionForms'),
      this.$store.dispatch('fetchUsers')
    ])
  },
  data() {
    return {
      confirmPopup: false,
      isPromptOpen: false,
      newPunishment: null,
      newComment: null
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
