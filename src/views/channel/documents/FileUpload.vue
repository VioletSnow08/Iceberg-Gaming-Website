<template>
  <div class="file-upload">
    <vs-input label="Document Title" v-model="name"></vs-input>
    <br>
    <input type="file" @change="onFileChange" />
    <br>
    <br>
    <vs-button @click="onUploadFile" class="upload-button"
            :disabled="!this.selectedFile">Upload file</vs-button>
  </div>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters} from "vuex";
import utils from "../../../../utils"

export default {
  data() {
    return {
      selectedFile: "",
      name: null
    };
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  methods: {
    ...mapActions(["uploadDocument"]),
    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
    },
    sendSuccessNotification() {
      this.$vs.notify({
        color: 'success',
        title: "File Uploaded!",
        time: 4000
      })
    },
    sendErrorNotification() {
      this.$vs.notify({
        color: 'danger',
        title: "Unable to upload file!",
        text: "Please make sure that the file type is a PDF or that the file doesn't already exist.",
        time: 4000
      })
    },
    async onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);  // appending file
      formData.append('channelID', this.$route.params.channelID);
      formData.append('accessToken', await this.currentUser.accessToken)
      formData.append('name', this.name);
      await this.uploadDocument([formData]).then(() => {
        this.$store.dispatch('fetchChannels');
        this.sendSuccessNotification();
      }).catch(error => {
        if (error) {
          this.sendErrorNotification();
        }
      })
    }
  }
};
</script>
