<script setup>
import LeftPanel from './components/LeftPanel.vue'
import MainForm from './components/MainForm.vue'
</script>

<template>
  <header>
    <a href="/">
      <img alt="Checkout.com" class="logo" src="./assets/Black-CKOSymbol-RGB.svg" width="90" height="90" />
    </a>

    <div class="wrapper">
      <a href="/"><LeftPanel msg="Checkout.com" /></a>
    </div>
  </header>

  <main>
    <MainForm />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
    justify-content: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
