<template>
  <div>
    <h4>Welcome to the Chryse Guard Security Application Form!</h4>
    <h5>If you have any questions please feel free to talk to a recruiter in #entry-point-and-recruitment</h5>
    <hr>
    <form-wizard color="rgba(var(--vs-primary), 1)" :title="null" :subtitle="null" finishButtonText="Submit"
                 @on-complete="formSubmitted">
      <tab-content title="Step 1" class="mb-5">

        <!-- tab 1 content -->
        <div class="vx-row">
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input label="Steam URL" v-model="steamURL" class="w-full"/>
          </div>
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input type="text" label="What is your favorite playstyle?" v-model="playstyle" class="w-full"/>
          </div>
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input type="text" label="Age" v-model="age" class="w-full"/>
          </div>
        </div>
      </tab-content>

      <!-- tab 2 content -->
      <tab-content title="Step 2" class="mb-5">
        <div class="vx-row">
          <div class="vx-col md:w-1/2 w-full">
            <vs-input label="Have you ever been part of another squadron?" v-model="squadron" class="w-full mt-4"/>
            <vs-input label="Where did you hear about our squadron?" v-model="whereDidYouHearAboutUs"
                      class="w-full mt-4"/>
          </div>

        </div>
      </tab-content>

      <!-- tab 3 content -->
      <tab-content title="Step 3" class="mb-5">
        <div class="vx-row mb-6">

          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea v-model="whyJoin" label="Why do you want to join our squadron?" class="mb-0 md:mt-10 mt-6"
                         rows="3"/>
          </div>
        </div>

        <h5>By selecting "Submit", you agree that you have you read, understood, and accepted all of Rules set forth within the <a href="https://www.guilded.gg/Iceberg-gaming/groups/v3j2vAP3/channels/08ca311e-66fb-45ce-bbbf-c4b34dc69e4a/docs/2016850748" target="_blank">Community Code of Conduct</a>.</h5>

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
      steamURL: '',
      age: '',
      playstyle: '',
      whyJoin: '',
      squadron: '',
      whereDidYouHearAboutUs: ''
    }
  },
  methods: {
    ...mapActions(['submitCGSApplication']),
    formSubmitted () {
      if (this.age < 13) return alert('Invalid Age, unable to submit.')
      this.submitCGSApplication([this.steamURL, this.age, this.playstyle, this.whyJoin, this.squadron, this.whereDidYouHearAboutUs])
    }
  },
  computed: {
    ...mapGetters(['user'])
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
