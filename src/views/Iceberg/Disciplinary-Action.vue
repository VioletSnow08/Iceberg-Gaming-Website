<template>
  <div>
    <h4>Welcome to the Disciplinary Action Form!</h4>
    <h5>Please only use this if you have tried to resolve the situation.</h5>
    <hr>
    <form-wizard color="rgba(var(--vs-primary), 1)" :title="null" :subtitle="null" finishButtonText="Submit"
                 @on-complete="formSubmitted">
      <tab-content title="Situational Information" class="mb-5">

        <!-- tab 1 content -->
        <div class="vx-row">
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input label="Who are you reporting?" v-model="offender" class="w-full"/>
          </div>
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input type="text" label="What Division did this occur in? Ex. 17th BCT." v-model="division" class="w-full"/>
          </div>
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input type="text" label="What day and time did this occur?" v-model="date" class="w-full"/>
          </div>
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input type="text" label="Where did this occur?" v-model="whereDidThisOccur" class="w-full"/>
          </div>
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input type="text" label="Was there anyone who observed at least one of these issues? If so, who?" v-model="witnesses" class="w-full"/>
          </div>
        </div>
      </tab-content>

      <!-- tab 2 content -->
      <tab-content title="Situational Description" class="mb-5">
        <div class="vx-row">
          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea label="Please explain in detail what happened" v-model="explanation" class="w-full mt-4"/>
          </div>
          <div class="vx-col md:w-1/2 w-full">
            <vs-input label="What rule did this person break?" v-model="infraction" class="w-full mt-4"/>
          </div>
          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea v-model="whatPunishment" label="What punishment do you think this person whould receive and why?" class="w-full mt-4"/>
          </div>
        </div>
      </tab-content>

      <!-- tab 3 content -->
      <tab-content title="Agreements" class="mb-5">
        <div class="vx-row mb-6">
          <h5>By clicking "Submit", you agree that everything in this form is answered to the best of your ability, knowledge, and belief.</h5>
        </div>
      </tab-content>
    </form-wizard>

  </div>

</template>
<script>
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {mapActions, mapGetters} from 'vuex'

export default {
  data () {
    return {
      offender: '',
      division: '',
      date: '',
      whereDidThisOccur: '',
      witnesses: '',
      explanation: '',
      infraction: '',
      whatPunishment: ''
    }
  },
  methods: {
    ...mapActions(['submitDisciplinaryActionReport']),
    formSubmitted () {
      if (this.age < 13) return alert('Invalid Age, unable to submit.')
      this.submitDisciplinaryActionReport([this.offender, this.division, this.date, this.whereDidThisOccur, this.witnesses, this.explanation, this.infraction, this.whatPunishment, this.currentUser.id])
    }
  },
  computed: {
    ...mapGetters(['user', 'currentUser'])
  },
  components: {
    FormWizard,
    TabContent
  }
}
</script>

<style scoped>
hr {
  margin: 15px 0;
}
</style>
