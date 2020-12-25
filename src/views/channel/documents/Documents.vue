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
import {mapGetters} from "vuex";

export default {
  name: "Documents",
  components: {
    FileUpload
  },
  computed: {
    ...mapGetters(["users", "user", "channels", "documents", "document"])
  },
  data() {
    return {
      openFileUpload: false
    }
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
      this.$store.dispatch('fetchUsers')
    ])
  }
}
</script>
