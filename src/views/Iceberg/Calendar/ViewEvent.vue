<template>
<div>
    
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: "ViewEventIcebergGaming",
    props: ["eventID"],
    computed: {
        ...mapGetters(["IcebergEvent"])
    }
}
</script>

<style>

</style>