<script setup>
import MainForm from './MainForm.vue'
import Modal from './Modal.vue';
</script>

<template>
<main>
    <MainForm @update-env="$emit('update-env', $event)" />
    <Modal v-show="isModalVisible" @close="closeModal" />
  </main>
  <button class="button-log" @click="showModal">Logs</button>
  
</template>



<script>
export default {
  data() {
    return {
      isModalVisible: false,
    }
  },
  components: {
    Modal,
  },
  methods: {
    showModal() {
    this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
}
</script>

<style>
.button-log {
    position: fixed;
    width: 80px;
    height: 20px;
    right: 0;
    top: calc(100% - 20px);
    font-size: small;
    background: #e8e8e8;
    border-color: black;
    border-radius: 5px;
    margin-right: 3px;
  }

</style>
  