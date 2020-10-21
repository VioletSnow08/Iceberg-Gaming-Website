<template>
  <div>
    <h4>Welcome to the Iceberg Gaming Application Form!</h4>
    <h5>If you have any questions please feel free to talk to a recruiter in #entry-point-and-recruitment</h5>
    <hr>
    <form-wizard color="rgba(var(--vs-primary), 1)" :title="null" :subtitle="null" finishButtonText="Submit"
                 @on-complete="formSubmitted">

      <!-- Personal Questions -->
      <tab-content title="Step 1" class="mb-5">
        <div class="vx-row">
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input label="Please provide a direct link to your Steam Profile" v-model="steamURL" class="w-full"/>
          </div>
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input label="What is your age?" v-model="age" class="w-full"/>
          </div>
          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea v-model="hobbies" label="What hobbies do you like to participate outside of gaming?"
                         class="mb-0 md:mt-10 mt-6"
                         rows="3"/>
          </div>
        </div>
      </tab-content>

      <!-- About Gaming -->
      <tab-content title="Step 2" class="mb-5">
        <div class="vx-row">
          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea v-model="gamesTheyJoinFor" label="What game(s) do you plan to join us for?"
                         class="mb-0 md:mt-10 mt-6"
                         rows="3"/>
          </div>
          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea v-model="hoursInGamesTheyJoinFor"
                         label="How many hours do you have in the game(s) that you plan to join us for?"
                         class="mb-0 md:mt-10 mt-6"
                         rows="3"/>
          </div>
        </div>
      </tab-content>

      <!-- Community Based -->
      <tab-content title="Step 3" class="mb-5">
        <div class="vx-row">
          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea v-model="areYouInAnyCommunities" label="Are you part of any other communities? If so, which one(s)?" class="mb-0 md:mt-10 mt-6"
                         rows="3"/>
          </div>
          <div class="vx-col md:w-1/2 w-full">
            <vs-textarea v-model="whyJoin" label="Why would you like to join our community?" class="mb-0 md:mt-10 mt-6"
                         rows="3"/>
          </div>
          <div class="vx-col md:w-1/2 w-full mt-5">
            <vs-input label="Where did you hear about us from?" v-model="whereDidYouHearUsFrom" class="w-full"/>
          </div>
        </div>
        <br>
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
  data() {
    return {
      steamURL: '',
      age: '',
      hobbies: '',
      whyJoin: '',
      whereDidYouHearUsFrom: '',
      areYouInAnyCommunities: '',
      hoursInGamesTheyJoinFor: '',
      gamesTheyJoinFor: ''
    }
  },
  methods: {
    ...mapActions(['submitIcebergApplication']),
    formSubmitted() {
      if (this.age < 13) return alert('Invalid Age, unable to submit.')
      this.submitIcebergApplication([this.steamURL, this.age, this.hoursInGamesTheyJoinFor, this.hobbies, this.areYouInAnyCommunities, this.whereDidYouHearUsFrom, this.gamesTheyJoinFor, this.whyJoin])
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
