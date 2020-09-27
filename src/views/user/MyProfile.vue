<template>
<div>
  <div class="text-center">
    <h1>My Profile</h1>
    <h2>Welcome to your Profile!</h2>
  </div>
<!--  CONTENT AND OTHER STUFF GOES HERE-->
</div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'MyProfile',
  computed: {
    ...mapGetters(["currentUser"]) // Reference the currentUser object to see what you can use.
  }
}
</script>

<style scoped>

</style>
