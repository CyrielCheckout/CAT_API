<script setup>
import axios from "axios";
</script>


<script>
  export default {
    name: 'Modal',
    logs: [],
    mounted() {
       axios
            .request({
              method: "GET",
              maxBodyLength: Infinity,
              url: "https://cat-configuration-helper-bak-sbox.ckotech.co/CatAPI/GetLogs",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            })
            .then((response) => {
              this.logs = response.data; // Store the array of log file names

            })
            .catch((error) => {
              console.error("Error fetching logs:", error);
            })
            .finally(() => {
              
            });
    },
    methods: {
      close() {
        this.$emit('close');
      },
      // Create a method to generate the URL for each log file
      getLogUrl(log) {
        return `https://cat-configuration-helper-bak-sbox.ckotech.co/CatAPI/GetLogs/${encodeURIComponent(log)}`; // Adjust the URL as needed
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
            See what happened in the logs...
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
            To see  more details about an event, please find and click on the good log file.
            <br/>
            <br/>
            <ul>
              <li v-for="log in logs" :key="log">
                <u><i><a :href="getLogUrl(log)" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >{{ log }}</a></i></u>
              </li>
            </ul>


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
    z-index:1;
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