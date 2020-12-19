<template>
  <div>
    <div>
      <hr>
      <div class="vx-col md:w-1/2 w-full mt-5">
        <vs-input disabled label="Who are you reporting?" v-model="form.offender" class="w-full"/>
      </div>
      <div class="vx-col md:w-1/2 w-full mt-5">
        <vs-input disabled type="text" label="What Division did this occur in? Ex. 17th BCT." v-model="form.division"
                  class="w-full"/>
      </div>
      <div class="vx-col md:w-1/2 w-full mt-5">
        <vs-input disabled type="text" label="What day and time did this occur?" v-model="form.date" class="w-full"/>
      </div>
      <div class="vx-col md:w-1/2 w-full mt-5">
        <vs-input disabled type="text" label="Where did this occur?" v-model="form.whereDidThisOccur" class="w-full"/>
      </div>
      <div class="vx-col md:w-1/2 w-full mt-5">
        <vs-input disabled type="text" label="Was there anyone who observed at least one of these issues? If so, who?"
                  v-model="form.witnesses" class="w-full"/>
      </div>
      <div class="vx-col md:w-1/2 w-full">
        <vs-input disabled label="What rule did this person break?" v-model="form.infraction" class="w-full mt-4"/>
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col md:w-1/2 w-full">
        <vs-textarea disabled label="Please explain in detail what happened" v-model="form.explanation" class="w-full mt-4"/>
      </div>
      <div class="vx-col md:w-1/2 w-full">
        <vs-textarea disabled v-model="form.whatPunishment"
                     label="What punishment do you think this person whould receive and why?" class="w-full mt-4"/>
      </div>
    </div>
  </div>


</template>
<script>
import {FormWizard, TabContent} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
import {mapActions, mapGetters} from 'vuex'

export default {
  props: ['form'],
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
