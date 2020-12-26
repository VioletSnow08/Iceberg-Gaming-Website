<template>
  <div>

  </div>

</template>

<script>
import {mapActions, mapGetters} from "vuex";
import utils, {doesUserContainRoles} from "../../../../../../utils";
import axios from "axios";

export default {
  // The params are automatically passed in by AG Grid.. They include the columns of that specific row such as photoURL, username, id, etc.
  // params.value is the param value for the specific column. In this case, it is the same as the username.
  name: 'CellRendererJoined',
  computed: {

  },
  async mounted() {

  },
  methods: {

  },
  data() {
    return {

    }
  }
}
</script>
