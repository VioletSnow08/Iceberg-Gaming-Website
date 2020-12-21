<template>
<div>
  <br>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>Please provide a direct link to your Steam Profile</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.steamURL"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>What is your age?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.age"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>What hobbies do you like to participate outside of gaming?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.hobbies"/>
    </div>
  </div>
  <br>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>What game(s) do you plan to join us for?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.gamesTheyJoinFor"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>How many hours do you have in the game(s) that you plan to join us for?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.hoursInGamesTheyJoinFor"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>Are you part of any other communities? If so, which one(s)?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.areYouInAnyCommunities"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>Why would you like to join our community?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.whyJoin"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>Where did you hear about us from?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.whereDidYouHearUsFrom"/>
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
name: "ApplicationBPIceberg",
  props: ['application']
}
</script>

<style scoped>

</style>
