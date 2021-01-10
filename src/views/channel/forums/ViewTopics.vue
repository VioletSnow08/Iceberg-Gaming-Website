<template>
<div>
  <vs-button @click="createTopicPopup=true" color="primary">Create Topic</vs-button>
  <br>
  <br>
  <vs-alert v-if="isSuccess" color="success">Topic Created!</vs-alert>
  <br>
  <br>
  <div class="vx-row">
    <div class="vx-col w-full lg:w-4/12 sm:w-1/2 mb-base" v-for="t in topics($route.params.channelID)" :key="topic.id">
      <vx-card :title="t.title" :subtitle="'Created By: ' + user(t.userID).username" class="p-2">
        <div class="text-center">
          <vs-button @click="viewTopic(t.id)" type="gradient" class="w-full mt-6" color="#F3DE2C" gradient-color-secondary="#493240">View Topic</vs-button>
        </div>
      </vx-card>
    </div>
  </div>




  <vs-popup fullscreen :active.sync="createTopicPopup" title="Create Topic">
    <vs-input v-model="title" label="Title"></vs-input>
    <br>
    <quill-editor v-model="body" :options="quillOptions"/>
    <vs-button color="primary" @click="createTopic([$route.params.channelID, title, body]); topicCreated=true; createTopicPopup=false; isSuccess=true;">Submit Topic</vs-button>
  </vs-popup>

</div>
</template>

<script>
import FileUpload from "@/views/channel/documents/FileUpload";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "Forums",
  components: {
    FileUpload
  },
  methods: {
    viewTopic(topicID) {
      this.$router.push('/channels/' + this.$route.params.channelID + '/topics/' + topicID);
    },
    ...mapActions(["createTopic"])
  },
  computed: {
    ...mapGetters(["users", "user", "channels", "topics", "topic"])
  },
  data() {
    return {
      createTopicPopup: false,
      title: null,
      body: null,
      isSuccess: false,
      quillOptions: {
        modules: {
          toolbar: [['bold', 'italic', 'code', 'strike', 'underline'], [{'header' : 1}, { 'header': 2}, {'list': 'ordered'}, {'list': 'bullet'}, 'align',], [{'header': [1, 2, 3, 4, 5, 6, false]}], ['link']]
        }
      }
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
