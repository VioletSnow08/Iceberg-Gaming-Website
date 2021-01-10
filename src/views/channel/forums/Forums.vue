<template>
<div>
  <div v-for="t in topics($route.params.channelID)" :key="topic.id"><h1>{{t.title}}</h1></div>
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
