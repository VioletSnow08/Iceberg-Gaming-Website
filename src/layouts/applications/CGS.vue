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
      <span>What is your favorite play style?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.playstyle"/>
    </div>
  </div>
  <br>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>Have you ever been part of another squadron?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.squadron"/>
    </div>
  </div>
  <div class="vx-row mb-6">
    <div class="vx-col sm:w-1/3 w-full">
      <span>Where did you hear about our squadron?</span>
    </div>
    <div class="vx-col sm:w-2/3 w-full">
      <vs-input class="w-full" disabled :placeholder="application.whereDidYouHearAboutUs"/>
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

  <br>
  <h3>Comment</h3>
  <p>{{ application.comment }}</p>
  <br>
</div>
</template>

<script>
export default {
name: "ApplicationBPCGS",
  props: ['application']
}
</script>

<style scoped>

</style>
