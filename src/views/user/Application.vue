<template>
  <div>
    <div v-if="application">
      <h1>Welcome to your Application!</h1>
      <h2>Use this to check the status and answers of your application here</h2>
      <hr>
      <h3>Personal Details</h3>
      <div id="personal">
        <h4>Steam URL: {{ application.steamURL }}</h4>
        <h4>Age: {{ application.age }}</h4>
        <h4>Timezone: {{ application.timezone }}</h4>
        <h4>What Hobbies do you like to participate in outside of gaming? {{ application.hobbies }}</h4>
      </div>
      <h3>Arma Related</h3>
      <div id="arma-related">
        <h4>How long have you played Arma 3 for? {{ application.arma3Hours }}</h4>
        <h4>Why do you want to join our community? {{ application.whyjoin }}</h4>
        <h4>What attracts you to the Arma 3 milsim playstyle? {{ application.attractmilsim }}</h4>
        <h4>What playstyle(s) interest you? {{ application.interestedRoles }}</h4>
        <h4 v-if="application.attendOps">Can you attend weekly Saturday Operations at 7:00pm CST? Yes</h4>
        <h4 v-else>Can you attend weekly Saturday Operations at 7:00pm CST? No</h4>
      </div>
    </div>
    <h1 v-else-if="!application">Sorry, but you haven't applied yet!</h1>


  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Application",
  methods: {
    ...mapActions(["setApplication"])
  },
  created() {
    this.setApplication();
  },
  computed: {
    ...mapGetters(["application"])
  }
}

</script>

<style scoped>
h3 {
  margin: 10px 0;
}

h4 {
  margin-left: 15px;
  padding-bottom: 5px;
}
</style>
