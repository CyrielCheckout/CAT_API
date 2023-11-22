<script setup>
import ProcessingChannelForm from './ProcessingChannelForm.vue'
</script>

<template>
  <div class="entity">
    <div>
      <p>Entity Name :</p>
      <input v-model="message" placeholder="Entity Name" />
    </div>
    <!-- <div>
      <ProcessingChannelForm></ProcessingChannelForm>
    </div> -->
    <br />
    <button @click="addPcChannel">Add a Processing Channel</button>
    <br />
    <div class="pcChannel" v-for="(pcChannel, counter) in pcChannels" v-bind:key="counter">
      <span @click="deletePcChannel(counter)">x</span>
      <ProcessingChannelForm></ProcessingChannelForm>
      <!--<label for="duration">{{counter+1}}. Previous Visa:</label>
        <input type="text" v-model.lazy="applicant.previous" required>
        <label for="duration">Year of expiration:</label>
        <input type="text" v-model.lazy="applicant.expiration" required>  -->
    </div>
  </div>
</template>

<style scoped>
.processing {
  margin-top: 2rem;
  display: flex;
  position: relative;
  flex-direction: column;
}

.details {
  flex: 1;
  margin-left: 1rem;
}

i {
  display: flex;
  place-items: center;
  place-content: center;
  width: 32px;
  height: 32px;

  color: var(--color-text);
}

h3 {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: var(--color-heading);
}

@media (min-width: 1024px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>

<script>
export default {
  data() {
    return {
      pcChannels: [ProcessingChannelForm]
    }
  },
  methods: {
    addPcChannel() {
      this.pcChannels.push(ProcessingChannelForm)
    },
    deletePcChannel(counter) {
      this.pcChannels.splice(counter, 1)
    }
  }
}
</script>
