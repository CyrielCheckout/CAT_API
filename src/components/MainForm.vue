<script setup>

import axios from "axios";
import _ from 'lodash';
import AppAccordion from "./AppAccordion.vue";
import { jwtDecode } from "jwt-decode";
import { format } from 'date-fns';
import Modal from './Modal.vue';

</script>

<template>
  <div id="catAdminForm">
    <app-accordion :is-open="true" class="mb-1 mt-4">
      <template v-slot:title>
        <span class="font-semibold text-xl">CAT Bearer Token : </span>
      </template>
      <template v-slot:content>
        <p style="white-space: pre-line"></p>
        <textarea v-model="Bearer" class="bearer" v-on:input="decryptBearerToken"
          placeholder="eyJraWQiOiJnSEh6djlqc....(Without Bearer)"></textarea>
      </template>
    </app-accordion>
    <div :style="{ color: `${messageColor}` }">Status: {{ status }} - Username: {{ username }} - Expiry Time: {{
      expiryTime }}</div>
    <p><i>(If your bearer is expired, <a href="#" @click="showModal"><u>click here to see how to get a new valid bearer
            token)</u></a></i></p>

    <Modal v-show="isModalVisible" @close="closeModal" />

    <hr class="mb-2 mt-2">

    <div class="form-row">
      <label for="ClientId">Client ID:</label>
      <input v-model="ClientId" class="clientId" placeholder="cli_xxx" />
    </div>

    <div class="form-row">
      <label for="field2">Delay (in ms):</label>
      <input v-model="delay" placeholder="ex : 10000 ms" />
    </div>

    <button class="btn btn-success mt-1 mb-1 pt-1 pb-1 pl-5 pr-5" @click="getClientId()">
      Find
    </button>

    <br />
    <ul v-if="isLoading">
      <loading v-model:active="isLoading" :color="'#186AFF'" :loader="'bars'" :height="50" :width="50" :can-cancel="false"
        :is-full-page="false" />
    </ul>
    <ul v-else-if="error">
      <li :style="{ color: `red` }">Error: {{ error }}</li>
    </ul>
    <ul v-else>
      <div class="card" v-for="(entity, eID) in Entity">
        <hr />
        <app-accordion :is-open="!(entity.EntityID.length > 0)" class="mb-1 mt-4">
          <template v-slot:title>
            <h4 class="card-title pl-2 pr-2">
              Entity {{ entity.EntityName }} ({{ entity.EntityID }})
            </h4>
            <span v-if="!(entity.EntityID.length > 0)" @click="deleteEntity(eID)" class="float-right"
              style="cursor: pointer">
              X
            </span>
          </template>
          <template v-slot:content>

            <div class="form-row pl-2">
              <label :hidden="(entity.EntityID?.length > 0)">Entity name: </label>
              <input type="text" class="form-control mb-2" placeholder="Name" :hidden="(entity.EntityID?.length > 0)"
                v-model="entity.EntityName" />
            </div>


            <!-- <div v-for="(processingChannel, pID) in entity.Processing_channel"> -->
            <div v-for="(channel, pID) in entity.Processing_channel" :key="channel.ProcessingChannelID">
              <div class="processing ml-10">
                <div class="form-row">
                  <label>{{ pID + 1 }} - ProcessingChannel ({{ channel.ProcessingChannelID }}): </label>
                  <input type="text" class="form-control mb-2" placeholder="Name"
                    :disabled="(channel.ProcessingChannelID?.length > 0)" v-model="channel.ProcessingChannelName" />
                </div>
                <div class=" ml-10">
                  <p>Payment Method : </p>
                  <div class="paymentMethods ml-10">
                    <div v-for="method in paymentMethods" :key="method.id">
                      <input type="checkbox" :checked="isChecked(method.id, channel.ProcessingChannelID)"
                        :disabled="isDisabled(method.id, channel.ProcessingChannelID)"
                        @change="toggleCheckbox(method.id, channel.ProcessingChannelID)" :value="method.id" />
                      <label>{{ ' ' + method.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="small_hr" />
            </div>

            <button class="btn btn-success mt-1 mb-1 pt-1 pb-1 pl-5 pr-5" @click="addNewProcessingChannel(eID)">
              Add processing channel
            </button>
          </template>
        </app-accordion>
      </div>

    </ul>
    <button class="btn btn-success mt-1 mb-1 pt-1 pb-1 pl-5 pr-5" @click="addNewEntity">
      Add an entity
    </button>

    <br />
    <button class="btn btn-success mt-1 mb-1 pt-1 pb-1 pl-5 pr-5" @click="createEntities">Submit</button>
  </div>
</template>

<style>
.form-row {
  display: flex;
  align-items: center;
  /* Vertical alignment */
  justify-content: space-between;
  /* Horizontal alignment */
  margin-bottom: 3px;
  margin-top: 3px;
  /* Optional: Add margin between rows */
}

label {
  margin-right: 10px;
  /* Optional: Add space between label and input */
  width: 40%;
}

input {
  width: 100%;
}

.card-title {
  font-weight: 600;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.paymentMethods {
  display: flex;
  justify-content: space-between;
}

.small_hr {
  margin-left: 120px;
  margin-right: 120px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.float-right {
  float: right;
  font-weight: 600;
}

hr {
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.bearer {
  width: 100%;
  height: 10em;
}

.clientId {
  width: 100%;
}

.accordion {
  border: none;
}
</style>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default {
  data() {
    return {
      isModalVisible: false,
      messageColor: "",
      username: "",
      expiryTime: "",
      status: "",
      Bearer: "eyJraWQiOiJtTlpYdXhvUjVpTWN2OGVFdm1kUnlnd3JHSjIxVlJPb1BFUjhiREdidG4wIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmZKeUFINFZwdkxoWDUzVDNSbzA2X2p6OG5lb0VKVEtIU1h0Nmw3Zm5EcVEiLCJpc3MiOiJodHRwczovL2NoZWNrb3V0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzc2t1ajN4YUNCN0ZUMmcwaDciLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzA1MDAzNDQxLCJleHAiOjE3MDUwMDcwNDEsImNpZCI6IjBvYXNrdHowMG5vTjVjQTV4MGg3IiwidWlkIjoiMDB1MWNmbHRvcHZ0c21xUDEwaDgiLCJzY3AiOlsicHJvZmlsZSIsImNsaWVudGFkbWluLXRvb2wiLCJvcGVuaWQiXSwiYXV0aF90aW1lIjoxNzA0OTYyOTQ4LCJzdWIiOiJmcmFuY29pcy5mYWxjb25ldEBjaGVja291dC5jb20iLCJmdWxsX25hbWUiOiJGcmFuw6dvaXMgRmFsY29uZXQiLCJjYXQtZ3JvdXBzIjpbIkFwcC5BdGxhcy5DQVQuU2FuZGJveC5TdXBwb3J0Il19.vlHXFNkATHWj4av9DBruQ3sSnSjUDWq9Exq2RMa5OGNaneh3bhMzkaymLqFEVi7ZSVVj7xcXh9lDd89yXQgj3XcWGx3fJYP9jR0w-52fzD7sCo11AFtchKevQRIKX_Ug0XuOdnTKu2EjBZ6OAZorj0QXULTOakVB7owLqG04m2Lv7eZJr9Iibd6JsdI64dupNwN-FIEPfcaYVY4ippNIu0xpgsYUV-F3dmtcu0Bbeao484F1U0BHX0ozkqeW-g1NB0Eg09OFydFAwe73MT5_dYV_oWvFaeU7gKOAfihkp_34p45aUlBOV7rSZYOfAfIcj6iiIl67UQ-1vX6pX6VN7A",
      ClientId: "cli_lggnvyogtibehexpagb2ydx6k4",
      delay: "1000",
      Entity: [],
      InitalEntity: [],
      newEntity: [],
      isLoading: false,
      error: '',
      paymentMethods: [
        {
          id: 'CARTES_BANCAIRES',
          name: "Cartes Bancaires",
        },
        {
          id: 'MASTERCARD',
          name: "Mastercard",
        },
        {
          id: 'VISA',
          name: "Visa",
        },
        {
          id: 'IDEAL',
          name: "Ideal",
        },
        {
          id: 'BANCONTACT',
          name: "Bancontact",
        },
        {
          id: 'SEPA',
          name: "Sepa",
        },
      ],
    };
  },
  mounted() {
    this.decryptBearerToken()
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
    decryptBearerToken() {
      try {
        const bearer = (this.Bearer).toLowerCase().startsWith('bearer') ? (this.Bearer) : 'Bearer ' + (this.Bearer)
        const decoded = jwtDecode(bearer);
        let now = new Date().getTime();
        let expiryDate = decoded.exp * 1000;
        this.username = decoded.full_name;
        this.expiryTime = format(expiryDate, 'dd/MM/yyyy HH:mm:ss');

        if (now < expiryDate) {
          this.messageColor = 'green';
          this.status = "OK"
        } else {
          this.messageColor = 'red';
          this.status = "EXPIRED"
        }
      } catch (error) {
        console.log(error);
        this.messageColor = 'red';
        this.username = "N/A"
        this.expiryTime = "N/A"
        this.status = "N/A"
      }
    },
    addNewEntity() {
      this.Entity.push({
        EntityID: "",
        EntityName: "",
        Processing_channel: [{
          ProcessingChannelID: "",
          ProcessingChannelName: "",
          PaymentMethod: [],
        }],
      });
      this.newEntity.push({
        EntityID: "",
        EntityName: "",
        Processing_channel: [{
          ProcessingChannelID: "",
          ProcessingChannelName: "",
          PaymentMethod: [],
        }],
      });
    },
    addNewProcessingChannel(id) {
      this.Entity[id].Processing_channel.push({
        ProcessingChannelID: "",
        ProcessingChannelName: "",
        PaymentMethod: [],
      });
      this.newEntity[id].Processing_channel.push({
        ProcessingChannelID: "",
        ProcessingChannelName: "",
        PaymentMethod: [],
      });
    },
    deleteEntity(counter) {
      this.Entity.splice(counter, 1);
      this.newEntity.splice(counter, 1);
    },
    async createEntities() {

      // Copy the entities to update / create in newPayload
      let newPayload = this.Entity;

      // Copy all PaymentMethod from newEntity to newPayload for each entities and processing Channel 
      // newEntity is containing all other PaymentMethod (new to create) that are not originally provided by the original entity.
      for (let i = 0; i < newPayload.length; i++) {
        if (this.newEntity[i] && this.newEntity[i].Processing_channel) {
          newPayload[i].Processing_channel.forEach((channel, index) => {
            if (this.newEntity[i].Processing_channel[index] && this.newEntity[i].Processing_channel[index].PaymentMethod) {
              newPayload[i].Processing_channel[index].PaymentMethod = this.newEntity[i].Processing_channel[index].PaymentMethod;
            }
          });
        }
      }

      console.log(JSON.stringify(newPayload, null, 2));

      // We remove all ProcessingChannel where PaymentMethod Array is empty
      newPayload.forEach(entity => {
        entity.Processing_channel = entity.Processing_channel.filter(
          channel => channel.PaymentMethod.length > 0
        );
      });

      // We remove all entities  where Processing_channel Array is empty
      newPayload = newPayload.filter(
        entity => entity.Processing_channel.length > 0
      );

      // Print the new JSON
      console.log(JSON.stringify(newPayload, null, 2));

      this.isLoading = true;
      this.error = '';

      await axios
        .request({
          method: "POST",
          maxBodyLength: Infinity,
          url: "http://127.0.0.1:4000/CatAPI/ConfigureMerchant",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          data: JSON.stringify({
            Bearer: (this.Bearer).toLowerCase().startsWith('bearer') ? (this.Bearer) : 'Bearer ' + (this.Bearer),
            ClientId: this.ClientId,
            delay: this.delay,
            Entity: newPayload
          }),
        })
        .then((res) => {
          //Perform Success Action
          console.log("res", res.data);
          /*this.isLoading = false;
          this.isLoading = true;
          this.getClientId();*/
        })
        .catch((error) => {
          console.log("error", error);
          this.error = error.message || 'Error occurred while fetching user info';
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
          //Perform action in always
        });

    },
    isDisabled(methodId, channelID) {
      // Check if the data is available before trying to access it
      if (!this.InitalEntity || !this.InitalEntity.length) {
        return false;
      }

      // Check if the methodId matches the original PaymentMethod for the given ProcessingChannelID
      return this.InitalEntity.some(entity =>
        entity.Processing_channel.some(channel =>
          channel.ProcessingChannelID === channelID &&
          channel.PaymentMethod.includes(methodId)
        )
      );
    },
    isChecked(methodId, channelID) {
      if (!this.InitalEntity || !this.InitalEntity.length) {
        return false;
      }

      return this.InitalEntity.some(entity =>
        entity.Processing_channel.some(channel =>
          channel.ProcessingChannelID === channelID &&
          channel.PaymentMethod.includes(methodId)
        )
      );
    },
    toggleCheckbox(methodId, channelID) {
      if (!this.newEntity || !this.newEntity.length) {
        return;
      }

      this.newEntity.forEach(entity => {
        entity.Processing_channel.forEach(channel => {
          if (channel.ProcessingChannelID === channelID) {
            const index = channel.PaymentMethod.indexOf(methodId);
            if (index === -1) {
              channel.PaymentMethod.push(methodId);
            } else {
              channel.PaymentMethod.splice(index, 1);
            }
          }
          console.log(entity.Processing_channel)
        });
      });
    },
    async getClientId() {
      this.isLoading = true;
      this.error = '';
      await axios
        .request({
          method: 'POST',
          maxBodyLength: Infinity,
          url: "http://127.0.0.1:4000/CatAPI/GetMerchantConf",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          data: JSON.stringify({
            Bearer: (this.Bearer).toLowerCase().startsWith('bearer') ? (this.Bearer) : 'Bearer ' + (this.Bearer),
            ClientId: this.ClientId
          }),
        })
        .then((res) => {
          //Perform Success Action
          if (res && res.data && res.data.Entity) {
            console.log("res", res.data.Entity);
            let resultEntities = res.data.Entity;

            // The BIND entity
            this.Entity = resultEntities;
            // make a copy of the initial given entities from ClientID. it will never change
            this.InitalEntity = _.cloneDeep(this.Entity);
            // make a copy of the initial given entities from ClientID. It is used to store all new paymentMethod (not containing in the original one)
            // PaymentMethod are not binding
            this.newEntity = _.cloneDeep(this.Entity);


            // Here we empty all paymentMethod in newEntity Object
            this.newEntity.forEach(entity => {
              // Set the PaymentMethod array to an empty arra
              entity.Processing_channel.forEach(channel => {
                channel.PaymentMethod = [];
              });
            });

            this.isLoading = false;
          } else {
            this.error = `No merchant found in sandbox with this ${this.ClientId}`;
            this.isLoading = false;
          }
        })
        .catch((error) => {
          this.Entity = []
          this.error = error.message || 'Error occurred while fetching user info';
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
};

</script>
