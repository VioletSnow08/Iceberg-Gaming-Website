<template>
  <div>
    <div class="text-center">
      <h1>User Management</h1>
      <h2>Manage the 17th Brigade Combat Team members here</h2>
    </div>

    <br>
    <div id="page-user-list">
      <div class="vx-card p-6">
        <vs-input class="sm:mr-4 mr-0 sm:w-auto w-full sm:order-normal order-3 sm:mt-0 mt-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Search..." />
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
</template>

<script>
import {AgGridVue} from 'ag-grid-vue'
import CellRendererLink from './cell-renderer/CellRendererLink.vue'
import CellRendererActivity from './cell-renderer/CellRendererActivity.vue'
import CellRendererPromotionDemotion from './cell-renderer/CellRendererPromotionDemotion.vue'
import CellRendererVerified from './cell-renderer/CellRendererVerified.vue'
import CellRendererActions from './cell-renderer/CellRendererActions.vue'
import vSelect from 'vue-select'

export default {
  name: "Users",
  components: {
    AgGridVue,
    CellRendererLink,
    CellRendererActivity,
    CellRendererActions,
    CellRendererVerified,
    CellRendererPromotionDemotion,
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
        {headerName: 'Discord ID', field: 'discord_id'},
        {headerName: "Promotion Status", field: 'promo_demo_status', cellRendererFramework: 'CellRendererPromotionDemotion'},
        {headerName: 'Events Attended', field: 'events_attended'},
        {headerName: 'Points', field: 'points'},
        {headerName: "Activity", field: 'activity', cellRendererFramework: 'CellRendererActivity'}
      ],
      usersData: [
        {username: 'Vinniehat', discord_id: '1234', events_attended: 0, points: 49, activity: 'On LOA', promo_demo_status: 'Demotable'},
        {username: 'BIG TOAST', discord_id: 'i eat toast', events_attended: 0, points: 49, activity: 'Active', promo_demo_status: 'Promotable'},
        {username: 'Ken the 74D', discord_id: 'your moms a ho - ken', events_attended: 0, points: 90000, activity: 'Active', promo_demo_status: 'Promotable'},
      ]
    }
  },
  mounted () {
    this.gridApi = this.gridOptions.api
  },
  methods: {
    updateSearchQuery (val) {
      this.gridApi.setQuickFilter(val)
    }
  }
}
</script>

<style scoped>

</style>
