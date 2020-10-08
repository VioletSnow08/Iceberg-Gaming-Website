<template>
  <div>
    <h1 class="text-center">Settings</h1>
    <h2 class="text-center">Customize your Iceberg Gaming Account</h2>
    <br>
    <!--    <div class="vx-row">-->
    <!--      &lt;!&ndash;      Starts the first VX ROW&ndash;&gt;-->
    <!--      <div class="row-right">-->
    <!--        <div v-if="currentUser.onLOA">-->
    <!--          <vs-button @click="confirmPopup=true" color="primary">End LOA</vs-button>-->
    <!--          <vs-popup classContent="popup-example" title="Are you sure you would like to end your current LOA"-->
    <!--                    :active.sync="confirmPopup">-->
    <!--            <vs-button @click="confirmEndLOA()" color="danger">End LOA</vs-button>-->
    <!--          </vs-popup>-->
    <!--        </div>-->
    <!--        <div v-else>-->
    <!--          <vs-button @click="popupActive=true" color="primary">Start LOA</vs-button>-->
    <!--          <vs-popup classContent="popup-example"-->
    <!--                    title="Please fill out the following details(end date and reason). Your LOA will begin immediately."-->
    <!--                    :active.sync="popupActive">-->
    <!--            <vs-alert :active.sync="endDateAlert" color="warning" closable icon-pack="feather" close-icon="icon-x">-->
    <!--              Please select an end date.-->
    <!--            </vs-alert>-->
    <!--            <vs-alert :active.sync="reasonAlert" color="warning" closable icon-pack="feather" close-icon="icon-x">Please-->
    <!--              type your reason for the LOA.-->
    <!--            </vs-alert>-->
    <!--            <br>-->
    <!--            <datepicker :inline="true" placeholder="Select End Date" v-model="date"></datepicker>-->
    <!--            <br>-->
    <!--            <vs-textarea class="inputx mb-3" placeholder="Reason" v-model="reason"/>-->
    <!--            <vs-button @click="submit()" :color="date && reason ? 'success' : 'danger'">Submit LOA</vs-button>-->
    <!--          </vs-popup>-->
    <!--        </div>-->
    <!--      </div>-->

    <!--      <vx-tooltip class="row-right" text="Will grab the current Discord Username and change it here too!">-->
    <!--        <vs-button @click="getDiscordUsername" color="primary">Re-Pull Discord Username</vs-button>-->
    <!--      </vx-tooltip>-->
    <!--      <vx-tooltip class="row-right" text="Will grab the current Discord Profile Picture and change it here too!">-->
    <!--        <vs-button @click="getDiscordProfilePicture" color="primary">Re-Pull Discord Profile Picture</vs-button>-->
    <!--      </vx-tooltip>-->
    <!--      <vs-button class="row-right" color="warning">Change Discord ID</vs-button>-->
    <!--      <vs-button @click="statusPopup=true" class="row-right" color="primary">Change Status</vs-button>-->
    <!--      <vs-popup classContent="popup-example"-->
    <!--                :title="'What would you like to change your status to, ' + currentUser.username + '?'"-->
    <!--                :active.sync="statusPopup">-->
    <!--        <vs-input type="text" placeholder="New Status..." v-model="newStatus"></vs-input>-->
    <!--        <br>-->
    <!--        <vs-button @click="submitStatus(newStatus)" color="success">Submit</vs-button>-->
    <!--      </vs-popup>-->
    <!--    </div>-->
    <!--    Ends the first VX ROW-->
    <vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs">

      <!-- GENERAL -->
      <vs-tab icon-pack="feather" icon="icon-user" label="General">
        <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
          <h1>General</h1>
        </div>
      </vs-tab>
      <vs-tab icon-pack="feather" icon="icon-file-plus" label="Leave of Absence">
        <div class="tab-general md:ml-4 md:mt-0 mt-4 ml-0">
          <h1>Leave of Absence(LOA)</h1>
          <h5>Do you have to take a break from the community? Fill out an LOA!</h5>
          <br>
          <div v-if="currentUser.onLOA">
            <vs-button @click="confirmLOAPopup=true" color="primary">End LOA</vs-button>
            <vs-popup classContent="popup-example" title="Are you sure you would like to end your current LOA"
                      :active.sync="confirmLOAPopup">
              <vs-button @click="confirmEndLOA()" color="danger">End LOA</vs-button>
            </vs-popup>
          </div>
          <div v-else>
            <vs-alert :active.sync="endDateAlert" color="warning" closable icon-pack="feather" close-icon="icon-x">-->
              Please select an end date.
            </vs-alert>
            <vs-alert :active.sync="reasonAlert" color="warning" closable icon-pack="feather" close-icon="icon-x">Please
              type your reason for the LOA.
            </vs-alert>
            <br>
            <datepicker :inline="true" placeholder="Select End Date" v-model="date"></datepicker>
            <br>
            <vs-textarea class="inputx mb-3" placeholder="Reason" v-model="reason"/>
            <vs-button @click="submit()" :color="date && reason ? 'success' : 'danger'">Submit LOA</vs-button>
          </div>

        </div>
      </vs-tab>
      <vs-tab icon-pack="feather" icon="icon-lock" label="Change Password">
        <div class="tab-change-pwd md:ml-4 md:mt-0 mt-4 ml-0">
          <h1>Change Password</h1>
        </div>
      </vs-tab>
      <vs-tab icon-pack="feather" icon="icon-info" label="Info">
        <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
          <h1>Credits and Info</h1>
          <p>This website was designed by: CPL Vincent Lauro</p>
          <p>The Discord Bot was designed by: SSG Eagle Trooper</p>
          <p style="color: lightcoral;">Content on this website may *only* be redistributed to the Iceberg Gaming
            official platforms. Violation of this will result in immediate removal from the community.</p>
          <p>Copyright 2020 - Iceberg Gaming</p>
        </div>
      </vs-tab>
    </vs-tabs>

  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import Datepicker from 'vuejs-datepicker';

export default {
  name: "Settings",
  computed: {
    ...mapGetters(["currentUser"])
  },
  data() {
    return {
      date: "",
      reason: "",
      popupActive: false,
      confirmLOAPopup: false,
      endDateAlert: false,
      reasonAlert: false,
      statusPopup: false,
      newStatus: "",
    }
  },
  components: {
    Datepicker
  },
  methods: {
    ...mapActions(["submitLOA", "endLOA", "getDiscordUsername", "getDiscordProfilePicture", "changeStatus"]),
    submit() {
      if (!this.date) {
        this.endDateAlert = true;
      } else if (!this.reason) {
        this.reasonAlert = true;
      } else {
        this.submitLOA([this.date, this.reason]);
        this.endDateAlert = false;
        this.reasonAlert = false;
        this.popupActive = false;
      }

    },
    confirmEndLOA() {
      this.confirmLOAPopup = false;
      this.endLOA();
    },
    submitStatus(newStatus) {
      this.changeStatus(newStatus);
      this.statusPopup = false;
    }
  }
}
</script>

<style scoped>
.row-right {
  margin-right: 5px !important;
}
</style>
