<script setup>
import { ref } from 'vue'
import axios from 'axios'

defineProps({
  msg: String,
  message: String
})

const count = ref(0)
const serverHello = ref({})

axios
  .get('http://127.0.0.1:4000/CatAPI/test')
  .then(response => (serverHello.value = response.data.message))
</script>

<template>
  <h1>{{ msg }}</h1>
  <h2>{{ serverHello }}</h2>
  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
