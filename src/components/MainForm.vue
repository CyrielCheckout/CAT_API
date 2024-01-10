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
            <span v-if="!(entity.EntityID.length > 0)"
              @click="deleteEntity(eID)"
              class="float-right"
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


            <div v-for="(processingChannel, pID) in entity.Processing_channel">
              <div class="processing ml-10">
                <div class="form-row">
                  <label>{{ pID + 1 }} - ProcessingChannel ({{ processingChannel.ProcessingChannelId }}): </label>
                  <input type="text" class="form-control mb-2" placeholder="Name"
                    :disabled="(processingChannel.ProcessingChannelId?.length > 0)"
                    v-model="processingChannel.ProcessingChannelName" />
                </div>
                <div class=" ml-10">
                  <p>Payment Method : </p>
                  <div class="paymentMethods ml-10">
                    <div v-for="paymentMethod in paymentMethods" :key="paymentMethod.id">


                        <input type="checkbox" v-model="processingChannel.PaymentMethod"
                        :value="paymentMethod.id"/>
                        <label>{{ ' ' + paymentMethod.name }}</label>

                      <!--<div v-else>
                        <input type="checkbox" v-model="processingChannel.PaymentMethod2"
                          :value="paymentMethod.id"
                           />
                        <label>{{ ' ' + paymentMethod.name }}</label> 
                      </div> -->



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
      Bearer: "eyJraWQiOiJtTlpYdXhvUjVpTWN2OGVFdm1kUnlnd3JHSjIxVlJPb1BFUjhiREdidG4wIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULktiWGRLZTc4X2l0NWxueWhoQllKYmdfcGNjNkU4RGJfTjJRMnMwTkd3R3ciLCJpc3MiOiJodHRwczovL2NoZWNrb3V0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzc2t1ajN4YUNCN0ZUMmcwaDciLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzA0ODk5NTEzLCJleHAiOjE3MDQ5MDMxMTMsImNpZCI6IjBvYXNrdHowMG5vTjVjQTV4MGg3IiwidWlkIjoiMDB1MWNmbHRvcHZ0c21xUDEwaDgiLCJzY3AiOlsib3BlbmlkIiwicHJvZmlsZSIsImNsaWVudGFkbWluLXRvb2wiXSwiYXV0aF90aW1lIjoxNzA0ODk5NTExLCJzdWIiOiJmcmFuY29pcy5mYWxjb25ldEBjaGVja291dC5jb20iLCJmdWxsX25hbWUiOiJGcmFuw6dvaXMgRmFsY29uZXQiLCJjYXQtZ3JvdXBzIjpbIkFwcC5BdGxhcy5DQVQuU2FuZGJveC5TdXBwb3J0Il19.KYweDe1n0wS70AmqFp5XghmaclMzQ4IfOBZQQBrF-uC5snw9fqpyYLSOOmRBmJQltgiySbFLwc7Zr-aGo9OrZAsBPl6-g-l1DfwWAthSjeLFkCpGvOYoi9ZIZWtg_5GbjWYrbIegXJsjZ6b19GUrwxvVOexku5cup7ryTkDOEWZTDvNKPbuC0FlIm0vYeX4wyRH23Me3n779dW0Wswd6Ssc4jrmSeS1e29e64z7-4aME6xGuEklJmWKvpFUe2GqpCLqMvXHW_QpLuSS8G-oaRU7DorTaO75F1ybmMNA-CVBAht-McZw4PUd-KCYFjTosiYrqnadYkGibCJ8FlOr1qQ",
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
          ProcessingChannelId: "",
          ProcessingChannelName: "",
          PaymentMethod: [],
        }],
      });
    },
    addNewProcessingChannel(id) {
      this.Entity[id].Processing_channel.push({
        ProcessingChannelId: "",
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
      const newPayload = renameKey(newJson, { ProcessingChannelId: 'ProcessingChannelID' });

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
    isDisable(eID, pID, paymentMethodId) {
      console.log("eID :",eID, "pID :",pID,"paymentMethodId :", paymentMethodId)
      console.log("Test return :",this.EntityBeforeChange[eID].Processing_channel[pID].PaymentMethod.includes(paymentMethodId))
      console.log("PaymentMethod Array =",this.EntityBeforeChange[eID].Processing_channel[pID].PaymentMethod)
      console.log("PaymentMethod Array =",this.EntityBeforeChange[eID].Processing_channel[pID].PaymentMethod2)
      // Disable the checkbox if paymentMethodId is present in the PaymentMethod array
      return this.EntityBeforeChange[eID].Processing_channel[pID].PaymentMethod.includes(paymentMethodId)
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

            //const modifiedArray = modifyKeys(resultEntities);
            let modifiedArray = renameKey(resultEntities, { Processing_Channel_Name: 'ProcessingChannelName' });
            modifiedArray = renameKey(modifiedArray, { Processing_Channel: 'Processing_channel' });
            modifiedArray = renameKey(modifiedArray, { Processing_Channel_Id: 'ProcessingChannelId' });
            modifiedArray = renameKey(modifiedArray, { Entity_Name: 'EntityName' });

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
  }
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
  return _.transform(obj, function (result, value, key) {
    const currentKey = keysMap[key] || key;
    result[currentKey] = _.isObject(value) ? renameKey(value, keysMap) : value;
  });
}
</script>
