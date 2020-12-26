<template>
  <div>

    <div v-if="!users || !usersData">
      <h1>{{ this.$vs.loading({type: "radius", text: "Loading Users..."}) }}</h1>
    </div>
    <div v-else>
      {{ this.$vs.loading.close() }}
      <div class="text-center">
        <h1>User Management</h1>
        <h2>Manage the Iceberg Gaming Applicants and Members here!</h2>
      </div>
      <br>
      <div id="page-user-list">
        <div class="vx-card p-6">
          <vs-input class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery"
                    @input="updateSearchQuery" placeholder="Search..."/>
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-material w-100 my-4 ag-grid-table"
            :columnDefs="columnDefs"
            :defaultColDef="defaultColDef"
            :rowData="usersData"
            rowSelection="multiple"
            colResizeDefault="shift">
          </ag-grid-vue>

        </div>
      </div>
    </div>


  </div>
</template>

<script>
import {AgGridVue} from 'ag-grid-vue'
import CellRendererLink from './cell-renderer/CellRendererUsername.vue'
import CellRendererVerified from './cell-renderer/CellRendererVerified.vue'
import CellRendererJoined from './cell-renderer/CellRendererJoined.vue'
import vSelect from 'vue-select'
import {mapGetters} from "vuex";

export default {
  name: "Users",
  components: {
    AgGridVue,
    CellRendererLink,
    CellRendererVerified,
    CellRendererJoined,
    vSelect
  },
  data() {
    return {
      // AgGrid
      gridApi: null,
      gridOptions: {},
      searchQuery: '',
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMenu: true,
      },
      columnDefs: [
        {headerName: 'Username', field: 'username', cellRendererFramework: 'CellRendererLink'},
        {headerName: 'Discord ID', field: 'discord'},
        {headerName: "Joined On", field: 'createdAt', width: 400}
      ],
      usersData: null
    }
  },
  mounted() {
    this.gridApi = this.gridOptions.api;
  },
  computed: {
    ...mapGetters(["users", "isUserOnLOA", "applications"])
  },
  methods: {
    updateSearchQuery(val) {
      this.gridApi.setQuickFilter(val)
    },
  },
  watch: {
    users: function () {
      let users = [];
      this.users.forEach(user => {
        let newUser = {
          username: user.username,
          discord: user.discord,
          loa_status: this.isUserOnLOA(user.id) ? 'On LOA' : 'Off LOA',
          id: user.id,
          photoURL: user.photoURL,
          roles: user.roles,
          createdAt: new Date(user.createdAt).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        }
        if(user.roles.includes("[ICE] Member")) {
          users.push(newUser);
        }
      })
      this.usersData = users;
    },
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('fetchApplications'),
      this.$store.dispatch('fetchUsers')
    ])
  }
}
</script>

<style scoped>

</style>
