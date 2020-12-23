<template>
  <div class="file">
    <form enctype="multipart/form-data">
      <div class="fields">
        <label>Upload File</label>
        <input type="file" />
      </div>
      <div class="fields">
        <vs-button>Upload</vs-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "FileUpload"
}
</script>

<style scoped>

</style>
