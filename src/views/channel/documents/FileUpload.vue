<template>
  <div class="file-upload">
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
        text: "Please make sure that the file type is a PDF.",
        time: 4000
      })
    },
    async onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);  // appending file
      formData.append('channelID', this.$route.params.channelID);
      formData.append('accessToken', await this.currentUser.accessToken)
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
