<template>
  <div>
    <div class="text-center">
      <vs-button icon="add" @click="openFileUpload=true">Upload Document</vs-button>
    </div>
    <br>
    <div class="vx-row">
      <div v-for="document in documents($route.params.channelID)" v-bind:key="document.id" class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base">
        <vx-card :title="document.name" class="p-2">
          <p>Created By: {{user(document.userID).username}}</p>
          <vs-button @click="viewDocument(document.id)" class="w-full mt-6" color="primary">View Document</vs-button>
        </vx-card>
      </div>
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
  methods: {
    viewDocument(documentID) {
      this.$router.push('/channels/' + this.$route.params.channelID + '/documents/' + documentID);
    }
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
