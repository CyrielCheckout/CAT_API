<!-- src/components/ReadmeViewer.vue -->
<template>
    <div class="prose">
      <Markdown v-if="readmeContent" :source="readmeContent" />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Markdown from 'vue3-markdown-it';
  import 'highlight.js/styles/github.css'; // Choose your preferred style
  
   
  export default {
    components: {
      Markdown
    },
    data() {
      return {
        readmeContent: ''
      };
    },
    methods: {
      fetchReadme() {
        axios.get('/README.md')
          .then(response => {
            this.readmeContent = response.data;
          })
          .catch(error => {
            console.error('Error fetching the README file:', error);
          });
      }
    },
    mounted() {
      this.fetchReadme();
    }
  };
  </script>


  
  <style scoped>
  .prose {
    max-width: 100%;
  }

  </style>
  