<template>
  <div class="processing">
    <div>
      <p>ProcessingChannel: </p>
<input v-model="message" placeholder="Processing Channel name" />
    </div>
    <div>
    <span>Payment Method : </span>
      <p style="white-space: pre-line;"></p>
      <input type="checkbox" id="cb" value="cb" v-model="checkedNames">
      <label for="cb">Carte Bancaire</label>

      <input type="checkbox" id="mastercard" value="mastercard" v-model="checkedNames">
      <label for="mastercard">Mastercard</label>

      <input type="checkbox" id="visa" value="visa" v-model="checkedNames">
      <label for="visa">Visa</label>

      <input type="checkbox" id="ideal" value="ideal" v-model="checkedNames">
      <label for="ideal">Ideal</label>

      <input type="checkbox" id="bancontact" value="bancontact" v-model="checkedNames">
      <label for="bancontact">Bancontact</label>

      <input type="checkbox" id="sepa" value="sepa" v-model="checkedNames">
      <label for="sepa">Sepa</label>
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
