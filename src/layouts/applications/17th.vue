<template>
<div>
  <br>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>SteamURL</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.steamURL"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>Timezone</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.timezone"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>Age</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.age"/>
    </div>
  </div>
  <br>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>How many hours have you played Arma 3 for?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.arma3Hours"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>What Hobbies do you like to participate in outside of gaming?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.hobbies"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>What attracts you to the Arma 3 milsim playstyle?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.attractmilsim"/>
    </div>
  </div>
  <div class="vx-col md:w-1/2 w-full md:mt-8">
    <div class="demo-alignment">
      <span>What playstyle(s) interest you?</span>
      <div class="flex">
        <vs-checkbox disabled v-model="application.interestedRoles.includes('Ranger')">Ranger</vs-checkbox>
        <vs-checkbox disabled v-model="application.interestedRoles.includes('Medic')">Medic</vs-checkbox>
        <vs-checkbox disabled v-model="application.interestedRoles.includes('Sapper')">Sapper</vs-checkbox>
        <vs-checkbox disabled v-model="application.interestedRoles.includes('Pilot')">Pilot</vs-checkbox>
        <vs-checkbox disabled v-model="application.interestedRoles.includes('Tank_Crew')">Tank Crew
        </vs-checkbox>
        <vs-checkbox disabled v-model="application.interestedRoles.includes('IDF')">IDF Support</vs-checkbox>
      </div>
    </div>
  </div>
  <br>
  <h3>Comment</h3>
  <p>{{ application.comment }}</p>
  <br>
</div>
</template>

<script>
export default {
name: "ApplicationBP17th",
  props: ['application']
}
</script>

<style scoped>

</style>
