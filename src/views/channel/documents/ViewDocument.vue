<template>
  <div>
    <div v-if="!channels">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Document..."}) }}</h1>
    </div>
    <div v-else-if="src && channels">
      {{ this.$vs.loading.close() }}
      <div class="text-center">
        <h1>Now Viewing: {{ this.document(this.$route.params.channelID, this.$route.params.documentID).name }}</h1>
        <p>Created By:
          {{
            this.user(this.document(this.$route.params.channelID, this.$route.params.documentID).userID).username
          }}</p>
        <vs-button
          :disabled="this.document(this.$route.params.channelID, this.$route.params.documentID).userID !== currentUser.id"
          style="margin-right: 15px;" color="warning" @click="isEditPopupOpen=true">Edit Document
        </vs-button>
        <vs-button
          :disabled="this.document(this.$route.params.channelID, this.$route.params.documentID).userID !== currentUser.id"
          color="danger" @click="isDeletePopupOpen=true">Delete Document
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

      <vs-popup :active.sync="isEditPopupOpen" title="Edit Document">
        <vs-input label="Document Name" v-model="newDocumentName"></vs-input>
        <br>
        <vs-button
          @click="editDocument([$route.params.channelID, $route.params.documentID, document($route.params.channelID, $route.params.documentID).filename, newDocumentName]); isEditPopupOpen=false">
          Submit
        </vs-button>
      </vs-popup>

      <vs-popup :active.sync="isDeletePopupOpen" title="Are you sure you want to delete this document?">
        <vs-button
          @click="deleteDocument([$route.params.channelID, $route.params.documentID, document($route.params.channelID, $route.params.documentID).filename, newDocumentName]); isDeletePopupOpen=false">
          Delete
        </vs-button>
      </vs-popup>
    </div>
    <div v-else-if="!document(this.$route.params.channelID, this.$route.params.documentID)">
      {{ this.$vs.loading.close() }}
      <vs-alert color="danger">Error: Document Not Found!</vs-alert>
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
    ...mapActions(["fetchDocument", "deleteDocument", "editDocument"])
  },
  components: {
    pdf
  },
  computed: {
    ...mapGetters(["users", "channels", "documents", "document", "user", "currentUser"]),
  },
  asyncComputed: {
    src: async function () {
      if (this.channels && this.document(this.$route.params.channelID, this.$route.params.documentID)) {
        return pdf.createLoadingTask(await this.fetchDocument([this.$route.params.channelID, this.$route.params.documentID, this.document(this.$route.params.channelID, this.$route.params.documentID).filename]))
      }
    }
  },
  data() {
    return {
      numPages: null,
      newDocumentName: null,
      isEditPopupOpen: false,
      isDeletePopupOpen: false
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


