<template>
<div>
  <h1>Now Viewing a Document</h1>
</div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "ViewDocument",
  computed: {
    ...mapGetters(["users", "channels", "documents", "document", "user"]),
    src: function() {
      if(this.channels) {
        return this.$store.dispatch('fetchDocument', [this.$route.params.channelID, this.$route.params.documentID, this.document(this.$route.params.channelID, this.$route.params.documentID).filename])
      }
    }
  },
  data() {
    return {

    }
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
      this.$store.dispatch('fetchUsers'),
    ])
  }
}
</script>

<style scoped>

</style>
