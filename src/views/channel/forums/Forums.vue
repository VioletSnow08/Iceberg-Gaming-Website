<template>
<div>
  <br>
  <div class="vx-row">
    <div class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base" v-for="t in topics($route.params.channelID)" :key="topic.id">
      <vx-card :title="'Title: ' + t.title" :subtitle="'Created By: ' + user(t.userID).username" class="p-2">
        <div class="text-center">
          <vs-button type="gradient" class="w-full mt-6" color="#F3DE2C" gradient-color-secondary="#493240">View Thread</vs-button>
        </div>
      </vx-card>
    </div>
  </div>

</div>
</template>

<script>
import FileUpload from "@/views/channel/documents/FileUpload";
import {mapGetters} from "vuex";

export default {
  name: "Forums",
  components: {
    FileUpload
  },
  methods: {
    viewDocument(documentID) {
      this.$router.push('/channels/' + this.$route.params.channelID + '/forums/' + documentID);
    }
  },
  computed: {
    ...mapGetters(["users", "user", "channels", "topics", "topic"])
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

<style scoped>

</style>
