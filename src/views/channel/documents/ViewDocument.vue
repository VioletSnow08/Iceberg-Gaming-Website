<template>
  <div>
    <div v-if="!src">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Document..."}) }}</h1>
    </div>
    <div v-else class="text-center">
      {{this.$vs.loading.close()}}
      <h1>Now Viewing: {{ this.document(this.$route.params.channelID, this.$route.params.documentID).name }}</h1>
      <p>Created By:
        {{ this.user(this.document(this.$route.params.channelID, this.$route.params.documentID).userID).username }}</p>
      <vs-button
        :disabled="this.document(this.$route.params.channelID, this.$route.params.documentID).userID !== currentUser.id"
        style="margin-right: 15px;" color="warning" @click="editDocument">Edit Document
      </vs-button>
      <vs-button
        :disabled="this.document(this.$route.params.channelID, this.$route.params.documentID).userID !== currentUser.id"
        color="danger" @click="deleteDocument">Delete Document
      </vs-button>
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
import {mapActions, mapGetters} from "vuex";
import pdf from 'vue-pdf'
import axios from "axios";
import utils from "../../../../utils"

export default {
  name: "ViewDocument",
  methods: {
    ...mapActions(["fetchDocument"])
  },
  components: {
    pdf
  },
  computed: {
    ...mapGetters(["users", "channels", "documents", "document", "user", "currentUser"]),
  },
  asyncComputed: {
    src: async function () {
      if (this.channels) {
        return pdf.createLoadingTask(await this.fetchDocument([this.$route.params.channelID, this.$route.params.documentID, this.document(this.$route.params.channelID, this.$route.params.documentID).filename]))
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
    src: function (val) {
      if (val) val.promise.then(pdf => {
        this.numPages = pdf.numPages;
      })
    }
  }
}
</script>

<style scoped>

</style>


