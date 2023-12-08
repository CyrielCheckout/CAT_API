<script setup>

import axios from "axios";
import EntityForm from "./EntityForm.vue";
import _ from 'lodash';
import AppAccordion from "./AppAccordion.vue";
import { jwtDecode } from "jwt-decode";
import { format } from 'date-fns';

</script>

<template>
  <div id="catAdminForm">
   

    <app-accordion class="mb-2 mt-4">
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

      <div class="form-row">
        <label for="ClientId">Client ID:</label>
        <input v-model="ClientId" class="clientId" placeholder="cli_xxx" />
      </div>
      
      <div class="form-row">
        <label for="field2">Delay (in ms):</label>
        <input v-model="delay" placeholder="ex : 10000 ms" />
      </div>

      <button class="btn btn-success mt-5 mb-5" @click="getClientId">
        Find
      </button>

    <br />

    <div class="card mb-3" v-for="(entity, index) in Entity">
      <hr />
      <h4 class="card-title">
        Entity {{ index + 1 }}
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
          v-model="entity.EntityName" />
        </div>
      

        <div
          v-for="(processingChannel, index) in entity.Processing_channel">
          <div class="processing">
            <div class="form-row">
              <label>ProcessingChannel: </label>
              <input
                type="text"
                class="form-control mb-2"
                placeholder="Name"
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
                    v-model="processingChannel.PaymentMethod"
                    :value="paymentMethod" />
                    <label>{{ ' ' + paymentMethod.name }}</label>
                </div>
              </div>
            </div>
          </div>
          <hr class="small_hr"/>
        </div>

      <button
        class="btn btn-success mt-5 mb-5"
        @click="addNewProcessingChannel(index)">
        New processing channel
      </button>
    </div>
    <button class="btn btn-success mt-5 mb-5" @click="addNewEntity">
      Add an entity
    </button>

    <br />
    <button @click="createEntities">Submit</button>
  </div>

</template>

<style>

.form-row {
  display: flex;
  align-items: center; /* Vertical alignment */
  justify-content: space-between; /* Horizontal alignment */
  margin-bottom: 10px; /* Optional: Add margin between rows */
}

label {
  margin-right: 10px; /* Optional: Add space between label and input */
  width: 30%;
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
export default {
  data() {
    return {
      messageColor: "",
      username: "",
      expiryTime: "",
      status: "",
      Bearer:
        "Bearer eyJraWQiOiJnSEh6djlqcUxFZTc3dVV2Mkhld19BUEZabUdsaEhDZVVldXVQUjhMQUQwIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjNFQkdabTFpSTBlNmpvRU9Xc1p3QmRfODdVX19IN0pXWURyZktpY0FvUVEiLCJpc3MiOiJodHRwczovL2NoZWNrb3V0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzc2t1ajN4YUNCN0ZUMmcwaDciLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzAxMzMzNDQ1LCJleHAiOjE3MDEzMzcwNDUsImNpZCI6IjBvYXNrdHowMG5vTjVjQTV4MGg3IiwidWlkIjoiMDB1MWNmbHRvcHZ0c21xUDEwaDgiLCJzY3AiOlsib3BlbmlkIiwiY2xpZW50YWRtaW4tdG9vbCIsInByb2ZpbGUiXSwiYXV0aF90aW1lIjoxNzAxMzMzNDQyLCJzdWIiOiJmcmFuY29pcy5mYWxjb25ldEBjaGVja291dC5jb20iLCJmdWxsX25hbWUiOiJGcmFuw6dvaXMgRmFsY29uZXQiLCJjYXQtZ3JvdXBzIjpbIkFwcC5BdGxhcy5DQVQuU2FuZGJveC5TdXBwb3J0Il19.X6KhXIjQMqGebES3CGpKOxzpqoH12dAQrmxjDnf5OhhyHMMphgMV3LW1zL46KF6jSWKYVGWX3DZ_oqVX-X4R9S8wXQK9Gi3jMqiGZSM6Wibl0-TsN0W5fr5YScRHw7WT_gjG_YbutmNeTs0yFJhIlF7fEWZDnw6_jXP-Y61K1-cA2w-BnDPc5-kcloTe9bL0gDvx4sBPgrr-VBwZAxE3hvbEnK4Kq4UAlPWRIlREYhZdT1_7T72xuFcumW4b5wLtFepAKbDTUEpqxkZFJYTdmGyucyJ0vropjsY3bpST96RamTxyNz-EBgBpTjENfxF5QutACbHfOO8lAoY_Ql_0kw",
      //ClientId: "cli_d2s6xmrsuezerh3uvt2utdui24",
      ClientId: "cli_sexhljunxgqeregcwxrzku6qyy",
      delay: "1000",
      Entity: [
        {
          EntityName: "",
          Processing_channel: [
            {
              ProcessingChannelName: "",
              PaymentMethod: [],
            },
          ],
        },
      ],
      paymentMethods: [
        {
          id: 'CB',
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
  methods: {
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
        EntityName: "",
        Processing_channel: [{
          ProcessingChannelName: "",
          PaymentMethod: [],
        }],
      });
    },
    addNewProcessingChannel(id) {
      this.Entity[id].Processing_channel.push({
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

      const Entity = transformPaymentMethodsToIds(this.Entity);

      await axios
        .request({
          method: "POST",
          maxBodyLength: Infinity,
          url: "http://127.0.0.1:4000/CatAPI/CATCreateMerchant",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          data: JSON.stringify({
            Bearer: this.Bearer,
            ClientId: this.ClientId,
            delay: this.delay,
            Entity
          }),
        })
        .then((res) => {
          //Perform Success Action
          console.log("res", res.data);
        })
        .catch((error) => {
          // error.response.status Check status code
          console.log("error", error);
        })
        .finally(() => {
          //Perform action in always
        });
        
    },
    async getClientId() {
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
            modifiedArray = renameKey(modifiedArray,  {Entity_Name: 'EntityName'});

            //REBUILD PaymentMethod JSON Format

            this.Entity = modifiedArray;
            console.log(JSON.stringify(modifiedArray));
          } else {
            this.Entity = []
          }


        })
        .catch((error) => {
          this.Entity = []
          console.log("error", error);
        })
        .finally(() => {
          //Perform action in always
        });
    }
  },
};


const transformPaymentMethodsToIds = (obj) => {
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
};


    function renameKey(obj, keysMap) { 
    return _.transform(obj, function(result, value, key) { 
      const currentKey = keysMap[key] || key; 
      result[currentKey] = _.isObject(value) ? renameKey(value, keysMap) : value; 
    });
  }
</script>
