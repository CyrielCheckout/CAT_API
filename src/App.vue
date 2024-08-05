<script setup>
import HeaderPanel from './components/HeaderPanel.vue'
import { SANDBOX } from './constants';
</script>

<template>
  <div>
    <header>
      <a href="/">
        <img alt="Checkout.com" class="logo" src="./assets/Black-CKOSymbol-RGB.svg" width="90" height="90" />
      </a>
  
      <div class="wrapper">
        <HeaderPanel msg="Checkout.com" :env=SANDBOX />
      </div>
    </header>
    <nav>
      <router-link to="/"></router-link>
      <router-link to="/readme" target="_blank"></router-link>
    </nav>
    <router-view @update-env="updateEnv"></router-view> <!-- Listen for update-env event -->
  </div>
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

<script>
export default {
  components: {
    HeaderPanel
  },
  data() {
    return {
      env: SANDBOX
    };
  },
  methods: {
    updateEnv(newEnv) {
      this.env = newEnv; // Update env when called from child components
    }
  }
};
</script>