<template>
  <div class="file-upload">
    <input type="file" @change="onFileChange" />
    <button @click="onUploadFile" class="upload-button"
            :disabled="!this.selectedFile">Upload file</button>
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
    async onUploadFile() {
      const formData = new FormData();
      formData.append("file", this.selectedFile);  // appending file
      formData.append('channelID', this.$route.params.channelID);
      formData.append('accessToken', await this.currentUser.accessToken)
      await this.uploadDocument([formData])
    }
  }
};
</script>
