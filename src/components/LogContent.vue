<template>
  <div class="file-content">
    <pre>{{ content }}</pre>
  </div>
</template>

<script>
export default {
  props: {
    content: String,
  },
};
</script>

<style scoped>
.file-content {
  padding: 20px;
  flex: 1;
}
</style>
