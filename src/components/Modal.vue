<script>
  export default {
    name: 'Modal',
    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
</script>

<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header
          class="modal-header"
          id="modalTitle"
        >
          <slot name="header">
            How to get a valid Bearer token ?
          </slot>
          <button
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close modal"
          >
            x
          </button>
        </header>

        <section
          class="modal-body"
          id="modalDescription"
        >
          <slot name="body">
            1 - Authenticate yourself on WARP/CloudFlare<br/>
            2 - Open your browser and connect to Sandbox <a href="https://client-admin.cko-sbox.ckotech.co/web/nas/" target="_blank">Client Admin Tools</a><br/>
            3 - Open the Network tab in your browser's developer tools.<br/>
            4 - Go to the Network Tab<br/>
            5 - Click on a request done by CAT and go to "header" tab<br/>
            6 - Copy the bearer token (without Bearer).<br/>
            <br/>
            <img src="../assets/CATAdminToolNotice.png" width="500px" >


          </slot>
        </section>

        <footer class="modal-footer">
          <slot name="footer">
          </slot>
          <button
            type="button"
            class="btn-green pr-2 pl-2"
            @click="close"
            aria-label="Close modal"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    /* display: flex; */
  }

  .modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #137dd9;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #137dd9;
    background: #054379;
  }

  .btn-green {
    color: #054379;
    background: #2a85cf;
    border: 1px solid #137dd9;
    border-radius: 2px;
  }

  .modal-fade-enter,
  .modal-fade-leave-to {
    opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity .5s ease;
  }
</style>