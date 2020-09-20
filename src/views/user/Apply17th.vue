<template>
  <div>
    <h4>Welcome to the 17th BCT Application Form!</h4>
    <h5>If you have any questions please feel free to talk to a recruiter in #entry-point-and-recruitment</h5>
    <hr>
    <vs-alert v-if="age < 13 && age !== ''" title="Danger" active="true" color="danger">
      In order to comply with COPPA, Steam, Discord, and any other laws we may be subject to, we require that all users are 13 or older. We are sorry, but this is out of our control.
    </vs-alert>
    <form-wizard color="rgba(var(--vs-primary), 1)" :title="null" :subtitle="null" finishButtonText="Submit"
                 @on-complete="formSubmitted">
      <tab-content title="Step 1" class="mb-5">

        <!-- tab 1 content -->
        <div class="vx-row">
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input label="Steam URL" v-model="steamURL" class="w-full"/>
          </div>
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input type="text" label="Timezone" v-model="timezone" class="w-full"/>
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
            <vs-input label="How many hours have you played Arma 3 for?" v-model="arma3Hours" class="w-full mt-4"/>
            <vs-input label="What Hobbies do you like to participate in outside of gaming?" v-model="hobbies"
                      class="w-full mt-4"/>
          </div>
          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea v-model="whyjoin" label="Why do you want to join our community?" class="mb-0 md:mt-10 mt-6"
                         rows="3"/>
          </div>
          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea v-model="attractmilsim" label="What attracts you to the Arma 3 milsim playstyle?"
                         class="mb-0 md:mt-10 mt-6" rows="3"/>
          </div>
        </div>
      </tab-content>

      <!-- tab 3 content -->
      <tab-content title="Step 3" class="mb-5">
        <div class="vx-row mb-6">
          <div class="vx-col md:w-1/2 w-full md:mt-8">
            <div class="demo-alignment">
              <span>What playstyle(s) interest you?</span>
              <div class="flex">
                <vs-checkbox v-model="ranger">Ranger</vs-checkbox>
                <vs-checkbox v-model="medic">Medic</vs-checkbox>
                <vs-checkbox v-model="sapper">Sapper</vs-checkbox>
                <vs-checkbox v-model="pilot">Pilot</vs-checkbox>
                <vs-checkbox v-model="tank_crew">Tank Crew</vs-checkbox>
                <vs-checkbox v-model="idf">IDF Support</vs-checkbox>
              </div>
            </div>
          </div>

          <div class="vx-col sm:w-2/3 w-full md:mt-8">
            <vs-checkbox class="inline-flex" v-model="attendOps">Can you attend weekly Saturday Operations at 7:00pm CST?</vs-checkbox>
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
      timezone: '',
      arma3Hours: '',
      hobbies: '',
      whyjoin: '',
      attractmilsim: '',
      ranger: '',
      medic: '',
      sapper: '',
      pilot: '',
      tank_crew: '',
      idf: '',
      attendOps: ''
    }
  },
  methods: {
    ...mapActions(['submitApplication']),
    formSubmitted () {
      if (this.age < 13) return alert('Invalid Age, unable to submit.')
      this.submitApplication([this.steamURL, this.age, this.timezone, this.arma3Hours, this.hobbies, this.whyjoin, this.attractmilsim, this.ranger, this.medic, this.sapper, this.pilot, this.tank_crew, this.idf, this.attendOps])
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
