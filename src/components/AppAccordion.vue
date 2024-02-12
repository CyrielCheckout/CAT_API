<template>
  <div>
    <button
      @click="toggleAccordion"
      class="flex items-center space-x-3 accordion"
      :aria-expanded="internalIsOpen"
      :aria-controls="`collapse${uid}`"
    >
      <slot name="title" />
      <svg
        class="w-3 transition-all duration-200 transform"
        :class="{
          'rotate-180': internalIsOpen,
          'rotate-0': !internalIsOpen,
        }"
        fill="none"
        stroke="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 10"
        aria-hidden="true"
      >
        <path
          d="M15 1.2l-7 7-7-7"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div v-show="internalIsOpen" :id="`collapse${uid}`">
      <slot name="content" />
    </div>
  </div>
</template>

<style>
.accordion {
  border: none;
  width: 100%;
  justify-content: space-between;
}
</style>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uid: undefined,
      internalIsOpen: this.isOpen,
    };
  },
  mounted() {
    this.uid = this._uid;
  },
  methods: {
    toggleAccordion() {
      this.internalIsOpen = !this.internalIsOpen;
      this.$emit('toggleAccordion', this.internalIsOpen);
    },
  },
};
</script>
