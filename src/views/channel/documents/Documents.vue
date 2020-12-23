<template>
<div>
  <h1>Documents Channel</h1>
  <vs-button @click="openFileUpload=true"></vs-button>
  <vs-popup :active.sync="openFileUpload" title="Upload Document">
    <FileUpload v-bind:channelID="$route.params.channelID"></FileUpload>
  </vs-popup>
</div>
</template>

<script>
import FileUpload from "@/views/channel/documents/FileUpload";
export default {
  name: "Documents",
  components: {
    FileUpload
  },
  data() {
    return {
      openFileUpload: false
    }
  }
}
</script>

<style scoped>

</style>
