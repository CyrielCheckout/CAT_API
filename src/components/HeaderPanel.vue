<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  },
  env: String
})
</script>

<template>
  <div class="greetings">
    <a href="/"><h1 class="green">{{ msg }}</h1></a>
    <a href="/"><h3>
      Welcome on the CAT Configuration Helper
      <!-- <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>. -->
    </h3></a>
    <!-- <p>Create Entities, Processing channels, Payment Method on <b>{{ env }}</b> 💻</p> -->
    <p>Create Entities, Processing channels, Payment Method on CAT 💻</p>
    <!-- <span style="font-size: 15px;">[- 🏠 <a :href="homeUrl" ><u><i>Home</i></u></a> | 👀 <a :href="readmeUrl" target="_blank"><u><i>README.md</i></u></a> | <a :href="confluenceUrl" target="_blank"><u><i>Help</i></u></a> ❓ | <a :href="logs" target="_blank"><u><i>Logs</i></u></a> 📂-]</span> -->
    <span style="font-size: 15px;">[- 🏠 <a :href="homeUrl" ><u><i>Home</i></u></a> | 👀 <a :href="readmeUrl" target="_blank"><u><i>README.md</i></u></a> | <a :href="confluenceUrl" target="_blank"><u><i>Help</i></u></a>❓-]</span>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  /*top: -10px;*/
}

h3 {
  font-size: 1.2rem;
}

.greetings {
  text-align: center;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: center;
  }
}
</style>

<script>
export default {
  data() {
    return {
    homeUrl: '/',
    confluenceUrl: 'https://checkout.atlassian.net/wiki/spaces/SE1/pages/6257737790/CAT+Configuration+Helper+Tool+Sandbox'
    }
  },
  computed: {
    readmeUrl() {
      return `${window.location.origin}/readme`;
    /* },
    logs() {
      return `${window.location.origin}/logs`;*/
    }
  }
};
</script>