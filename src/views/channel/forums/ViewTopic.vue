<template>
  <div>
    <div v-if="!channels || !users">
      <h1>{{ this.$vs.loading({type: "sound", text: "Loading Topic..."}) }}</h1>
    </div>

    <div
      v-else-if="channel($route.params.channelID) && topics && topic($route.params.channelID, $route.params.topicID)">
      {{ this.$vs.loading.close() }}
      <vs-alert v-if="isSuccess" color="success">Reply Created! Please refresh the page.</vs-alert>
      <h1>Title: {{ topic($route.params.channelID, $route.params.topicID).title }}</h1>
      <h3>Created By: {{ user(topic($route.params.channelID, $route.params.topicID).userID).username }}</h3>
      <h3>Created At:
        {{ new Date(topic($route.params.channelID, $route.params.topicID).createdAt).toDateString() + ' ' + new Date(topic($route.params.channelID, $route.params.topicID).createdAt).toTimeString() }}</h3>
      <vs-button style="margin-right: 15px;" @click="createReplyPopup=true" color="primary">Reply</vs-button>
      <vs-button :disabled="topic($route.params.channelID, $route.params.topicID).userID !== currentUser.id"
                 @click="deleteTopic([$route.params.channelID, $route.params.topicID])" color="danger">Delete Topic
      </vs-button>
      <vs-button style="margin-left: 15px;" color="warning" @click="editTopicPopup=true">Edit Topic</vs-button>

      <vs-divider></vs-divider>
      <h1>Body</h1>
      <vs-divider></vs-divider>
      <div v-html="topic($route.params.channelID, $route.params.topicID).body"></div>
      <vs-divider></vs-divider>
      <h1>Replies</h1>
      <vs-divider></vs-divider>
      <div v-for="reply in replies($route.params.channelID, $route.params.topicID)" :key="reply.id">
        <h4>From: {{ user(reply.userID).username }}</h4>
        <h5>Created At:
          {{ new Date(reply.createdAt).toDateString() + ' ' + new Date(reply.createdAt).toTimeString() }}</h5>
        <br>
        <vs-textarea disabled v-model="reply.body"></vs-textarea>
        <vs-button @click="deleteReply([$route.params.channelID, $route.params.topicID, reply.id])"
                   :disabled="reply.userID !== currentUser.id" color="danger">Delete
        </vs-button>
        <vs-divider></vs-divider>
      </div>

      <vs-popup :active.sync="createReplyPopup" title="Create Reply">
        <vs-textarea v-model="replyText" label="Body"></vs-textarea>
        <vs-button
          @click="createReply([$route.params.channelID, $route.params.topicID, replyText]); isSuccess=true; createReplyPopup=false;"
          color="primary">Submit
        </vs-button>
      </vs-popup>

      <vs-popup fullscreen :active.sync="editTopicPopup" title="Edit Topic">
        <vs-input v-model="newTitle" label="Title"></vs-input>
        <br>
        <quill-editor v-model="newBody" :options="quillOptions"/>
        <br>
        <vs-button color="primary"
                   @click="editTopic([$route.params.channelID, $route.params.topicID, newTitle, newBody]); editTopicPopup=false;">
          Edit Topic
        </vs-button>
      </vs-popup>
    </div>

    <div v-else>
      {{ this.$vs.loading.close() }}
      <vs-alert color="danger">Error: Channel/Topic not found!</vs-alert>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: "ViewThreads",
  data() {
    return {
      createReplyPopup: false,
      replyText: null,
      isSuccess: false,
      newTitle: null,
      newBody: null,
      editTopicPopup: false,
      quillOptions: {
        modules: {
          toolbar: [['bold', 'italic', 'code', 'strike', 'underline'], [{'header': 1}, {'header': 2}, {'list': 'ordered'}, {'list': 'bullet'}, 'align',], [{'header': [1, 2, 3, 4, 5, 6, false]}], ['link']]
        }
      }
    }
  },
  methods: {
    ...mapActions(["createReply", "deleteReply", "deleteTopic", "editTopic"])
  },
  computed: {
    ...mapGetters(["channels", "channel", "topics", "topic", "users", "user", "currentUser", "replies"])
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchChannels'),
      this.$store.dispatch('fetchUsers'),
    ])
  },
  watch: {
    channels: function () {
      if (this.channels) {
        if (this.channel(this.$route.params.channelID)) {
          if (this.channel(this.$route.params.channelID).topics) {
            if (this.topic(this.$route.params.channelID, this.$route.params.topicID)) {
              let topic = this.topic(this.$route.params.channelID, this.$route.params.topicID);
              this.newTitle = topic.title;
              this.newBody = topic.body;
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
