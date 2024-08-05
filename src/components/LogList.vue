<script setup>
import axios from "axios";
</script>

<script>
  export default {
    data() {
      return {
        logs: [],
      }
    },
    mounted() {
       axios
            .request({
              method: "GET",
              maxBodyLength: Infinity,
              url: "http://127.0.0.1:4000/CatAPI/GetLogs",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            })
            .then((response) => {
              this.logs = response.data; // Store the array of log file names

            })
            .catch((error) => {
              console.error("Error fetching logs:", error);
            })
            .finally(() => {
              
            });
    },
    methods: {
      selectFile(file) {
        console.log(file)
        this.$emit('file-selected', file);
      },
       // Create a method to generate the URL for each log file
       getLogUrl(log) {
        return `http://127.0.0.1:4000/CatAPI/GetLogs/${encodeURIComponent(log)}`; // Adjust the URL as needed
      },
    },
  };
  </script>

<template>
  <p>See what happened in the logs...</p>
    <div class="log-list">
      <ul>
        <li v-for="log in logs" :key="log" @click="selectFile(log)">
          {{ log }}
        </li>
      </ul>
    </div>
  </template>
  
  
  
  <style scoped>
  .log-list {
    width: 200px;
    border-right: 1px solid #ccc;
  }
  .log-list ul {
    list-style: none;
    padding: 0;
  }
  .log-list li {
    padding: 10px;
    cursor: pointer;
  }
  .log-list li:hover {
    background-color: #f0f0f0;
  }
  </style>
  