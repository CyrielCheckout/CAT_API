<script setup>

import axios from "axios";
import EntityForm from "./EntityForm.vue";
import _ from 'lodash';
import AppAccordion from "./AppAccordion.vue";
import { jwtDecode } from "jwt-decode";
import { format } from 'date-fns';
import Modal from './Modal.vue';

</script>

<template>
  <div id="catAdminForm">
    <app-accordion class="mb-1 mt-4">
      <template v-slot:title>
        <span class="font-semibold text-xl">CAT Bearer Token : </span>
      </template>
      <template v-slot:content>
        <p style="white-space: pre-line"></p>
    <textarea
      v-model="Bearer" class="bearer" @blur="decryptBearerToken"
      placeholder="Bearer eyJraWQiOiJnSEh6djlqc...."></textarea>
      </template>
    </app-accordion>
    <div :style="{ color: `${messageColor}` }">Status: {{ status }} - Username: {{ username}} - Expiry Time: {{ expiryTime}}</div>
    <p><i>(If your bearer is expired, <a href="#" @click="showModal"><u>click here to see how to get a new valid bearer token)</u></a></i></p>

    <Modal
      v-show="isModalVisible"
      @close="closeModal"
    />

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
      <loading v-model:active="isLoading"
                :color="'#186AFF'"
                :loader="'bars'"
                :height="50"
                :width="50"
                 :can-cancel="false"
                 :is-full-page="false"/>
    </ul>
    <ul v-else-if="error">
      <li :style="{ color: `red` }">Error: {{ error }}</li>
    </ul>
    <ul v-else>
      <div class="card" v-for="(entity, index) in Entity">
        <hr />
        <h4 class="card-title">
          Entity {{ index + 1 }} ({{ entity.EntityID }})
          <span
            @click="deleteEntity(index)"
            class="float-right"
            style="cursor: pointer">
            X
          </span>
        </h4>
        <div class="form-row">
        <label>Entity: </label>
          <input
            type="text"
            class="form-control mb-2"
            placeholder="Name"
            :disabled="(entity.EntityID?.length > 0)" 
            v-model="entity.EntityName" />
          </div>
        

          <div
            v-for="(processingChannel, index) in entity.Processing_channel">
            <div class="processing">
              <div class="form-row">
                <label>{{ index + 1 }} - ProcessingChannel: </label>
                <input
                  type="text"
                  class="form-control mb-2"
                  placeholder="Name"
                  :disabled="(processingChannel.ProcessingChannelId?.length > 0)" 
                  v-model="processingChannel.ProcessingChannelName" />
              </div>
              <div>
                <p>Payment Method : </p>
                <div class="paymentMethods">
                  <div
                    v-for="paymentMethod in paymentMethods"
                    :key="paymentMethod.id">
                    <input
                      type="checkbox"
                      :disabled="(processingChannel.ProcessingChannelId?.length > 0)" 
                      v-model="processingChannel.PaymentMethod"
                      :value="paymentMethod.id" />
                      <label>{{ ' ' + paymentMethod.name }}</label>
                  </div>
                </div>
              </div>
            </div>
            <hr class="small_hr"/>
          </div>
        <button
          class="btn btn-success mt-1 mb-1 pt-1 pb-1 pl-5 pr-5"
          @click="addNewProcessingChannel(index)">
          Add processing channel
        </button>
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
  align-items: center; /* Vertical alignment */
  justify-content: space-between; /* Horizontal alignment */
  margin-bottom: 2px; /* Optional: Add margin between rows */
}

label {
  margin-right: 10px; /* Optional: Add space between label and input */
  width: 40%;
}

input {
  width:100%;
}

.card-title {
  font-weight: 600;
  margin-bottom: 5px;
}

.paymentMethods {
  display:flex;
  justify-content: space-between;
}
.small_hr {
      margin-left: 120px;
    margin-right: 120px;
    margin-top: 10px;
    margin-bottom: 10px;
}
.float-right {
  float:right;
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

.accordion{
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
      Bearer:"",
      ClientId: "cli_lggnvyogtibehexpagb2ydx6k4",
      delay: "1000",
      Entity: [],
      EntityBeforeChange: [],
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
        const decoded = jwtDecode(this.Bearer);
        let now = new Date().getTime();
        let expiryDate = decoded.exp * 1000;
        this.username = decoded.full_name;
        this.expiryTime = format(expiryDate, 'dd/MM/yyyy HH:mm:ss');

        if(now < expiryDate) {
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
          ProcessingChannelId:"",
          ProcessingChannelName: "",
          PaymentMethod: [],
        }],
      });
    },
    addNewProcessingChannel(id) {
      this.Entity[id].Processing_channel.push({
        ProcessingChannelId:"",
        ProcessingChannelName: "",
        PaymentMethod: [],
      });
    },
    deleteEntity(counter) {
      this.Entity.splice(counter, 1);
    },
    async createEntities() {
      console.log(this.Bearer);
      console.log(this.ClientId);
      console.log(this.delay);
      console.log(JSON.stringify(this.Entity));

      // Filter objects with empty EntityID or empty ProcessingChannelId
      const filteredJson = this.EntityBeforeChange.filter(obj => !obj.EntityID || obj.Processing_channel.some(channel => !channel.ProcessingChannelId));

      // Build a new JSON with the same structure
      const newJson = filteredJson.map(obj => {
          const newObj = { ...obj };
          if (!newObj.EntityID) delete newObj.EntityID;
          newObj.Processing_channel = newObj.Processing_channel.map(channel => {
              if (!channel.ProcessingChannelId) delete channel.ProcessingChannelId;
              return channel;
          });
          return newObj;
      });
      const newPayload = renameKey(newJson,  {ProcessingChannelId: 'ProcessingChannelID'});

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
            Bearer: this.Bearer,
            ClientId: this.ClientId,
            delay: this.delay,
            Entity: newPayload
          }),
        })
        .then((res) => {
          //Perform Success Action
          console.log("res", res.data);
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
            Bearer: this.Bearer,
            ClientId: this.ClientId
          }),
        })
        .then((res) => {
          //Perform Success Action
          if (res && res.data && res.data.Entity) {
            console.log("res", res.data.Entity);
            let resultEntities = res.data.Entity;

            //const modifiedArray = modifyKeys(resultEntities);
            let modifiedArray = renameKey(resultEntities, {Processing_Channel_Name: 'ProcessingChannelName'});
            modifiedArray = renameKey(modifiedArray,  {Processing_Channel: 'Processing_channel'});
            modifiedArray = renameKey(modifiedArray,  {Processing_Channel_Id: 'ProcessingChannelId'});
            modifiedArray = renameKey(modifiedArray,  {Entity_Name: 'EntityName'});

            this.Entity = modifiedArray;
            this.EntityBeforeChange = modifiedArray;
            console.log(JSON.stringify(modifiedArray));
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


/*const transformPaymentMethodsToIds = (obj) => {
  if (_.isArray(obj)) {
    return _.map(obj, (item) => {
      if (_.has(item, 'PaymentMethod')) {
        item.PaymentMethod = _.map(item.PaymentMethod, 'id');
      }
      return transformPaymentMethodsToIds(item);
    });
  } else if (_.isObject(obj) && !_.isFunction(obj)) {
    return _.mapValues(obj, (value) => transformPaymentMethodsToIds(value));
  } else {
    return obj;
  }
};*/


    function renameKey(obj, keysMap) { 
    return _.transform(obj, function(result, value, key) { 
      const currentKey = keysMap[key] || key; 
      result[currentKey] = _.isObject(value) ? renameKey(value, keysMap) : value; 
    });
  }
</script>
