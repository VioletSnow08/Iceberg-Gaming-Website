<template>
<div>
  <div class="text-center">
    <h1>Now Viewing: {{this.document(this.$route.params.channelID, this.$route.params.documentID).name}}</h1>
    <p>Created By: {{this.user(this.document(this.$route.params.channelID, this.$route.params.documentID).userID).username}}</p>
  </div>
  <br>
  <br>
  <div class="vx-row">
    <pdf
      v-for="i in numPages"
      :key="i"
      :src="src"
      :page="i"
      class="vx-col"
      style="width: 50%; margin: 5px 0;"
    ></pdf>
  </div>

</div>
</template>

<script>
import {mapGetters} from "vuex";
import pdf from 'vue-pdf'
import axios from "axios";
import utils from "../../../../utils"
export default {
  name: "ViewDocument",
  components: {
    pdf
  },
  computed: {
    ...mapGetters(["users", "channels", "documents", "document", "user", "currentUser"]),
  },
  asyncComputed: {
    src: async function () {
      if (this.channels) {
        let resp;
        return pdf.createLoadingTask(await axios.post(`${utils.base_url}/channels/document`, {
          channelID: this.$route.params.channelID,
          documentID: this.$route.params.documentID,
          filename: this.document(this.$route.params.channelID, this.$route.params.documentID).filename,
          accessToken: await this.currentUser.accessToken
        }, {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
          }
        }))
      }
    }
  },
  data() {
    return {
      numPages: null
    }
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
      this.$store.dispatch('fetchUsers'),
    ])
  },
  watch: {
    src: function(val) {
      if(val) val.promise.then(pdf => {
        this.numPages = pdf.numPages;
      })
    }
  }
}
</script>

<style scoped>

</style>


