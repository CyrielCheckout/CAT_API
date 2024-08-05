<script setup>
import axios from "axios";
</script>

<template>
    <div class="home">
      <LogList @file-selected="handleFileSelected" />
      <LogContent :content="selectedFileContent" />
    </div>
  </template>
  
  <script>
  import LogList from '../components/LogList.vue';
  import LogContent from '../components/LogContent.vue';
  
  export default {
    components: {
      LogList,
      LogContent,
    },
    data() {
      return {
        selectedFileContent: '',
      };
    },
    methods: {
      handleFileSelected(file) {
        axios
            .get(`http://127.0.0.1:4000/CatAPI/GetLogs/${encodeURIComponent(file)}`)
            .then(response => (this.selectedFileContent = response))
        //this.selectedFileContent = file.content;
      },
    },
  };
  </script>
  
  <style scoped>
  .home {
    display: flex;
  }
  </style>
  