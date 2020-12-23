<template>
  <div>
    <div class="text-center">
      <vs-button icon="add" @click="openFileUpload=true">Upload Document</vs-button>
    </div>


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
