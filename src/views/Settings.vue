<template>
  <div>
    <h1 class="text-center">Settings</h1>
    <h2 class="text-center">Customize your Iceberg Gaming Account</h2>
    <br>

    <vs-tabs position="left" class="tabs-shadow-none" id="profile-tabs">

      <!-- User Info change -->

      <vs-tab icon-pack="feather" icon="icon-user" label="User Info">

        <div>

          <h1>User Info</h1>
          <br>
          <vs-alert closable :active.sync="showConfirmationAlert_UserInfo" color="success">Settings saved!</vs-alert>
          <vs-input
            :placeholder="currentUser.status"
            class="input-spacing"
            style="resize: none; width: 550px !important"
            label="Change Status"
            maxlength="75"
            v-model="newStatus"
            name="status"
          />

          <vs-input
            class="input-spacing"
            label="Change Discord ID"
            :placeholder="currentUser.discord_id"
            v-model="newDiscordID"
            style="width: 200px !important"
          />

          <vs-switch class="input-spacing" v-model="newIsEmailPublic">
            <span slot="on" color="success">Show Email</span>
            <span slot="off" color="danger">Hide Email</span>
          </vs-switch>
          <vs-button @click="saveChanges_UserInfo()" class="input-spacing" color="success" type="relief">Save Changes
          </vs-button>
        </div>
      </vs-tab>


      <!-- End user info change -->
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
            <vs-button @click="verifyLOA()" :color="date && reason ? 'success' : 'danger'">Submit LOA</vs-button>
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
          <p>This website was designed by: CPL Vincent Lauro (Lead) and Zachary Zahradka/2_Z_Zach</p>
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
    ...mapGetters(["currentUser"]),
  },
  mounted() {
    this.newIsEmailPublic = this.currentUser.isEmailPublic;
  },
  data() {
    return {
      date: "",
      reason: "",
      popupActive: false,
      confirmLOAPopup: false,
      endDateAlert: false,
      reasonAlert: false,
      LOAStatusPopup: false,
      newIsEmailPublic: null,
      newStatus: "",
      newDiscordID: "",
      showConfirmationAlert_UserInfo: false
    }
  },
  components: {
    Datepicker
  },
  methods: {
    ...mapActions(["submitLOA", "endLOA", "changeDiscordID", "changeStatus", "changeIsEmailPublic"]),
    verifyLOA() {
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
    saveChanges_UserInfo() {
      if (this.newDiscordID !== "") {
        this.changeDiscordID(this.newDiscordID);
      }
      if (this.newStatus !== "") {
        this.changeStatus(this.newStatus);
      }
      this.changeIsEmailPublic(this.newIsEmailPublic);
      this.showConfirmationAlert_UserInfo = true;
    },
    confirmEndLOA() {
      this.confirmLOAPopup = false;
      this.endLOA();
    },
  },
}
</script>

<style scoped>
.row-right {
  margin-right: 5px !important;
}

.input-spacing {
  margin-top: 20px;
}
</style>
