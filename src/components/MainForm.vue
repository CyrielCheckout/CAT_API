<script setup>

import axios from "axios";
import _ from 'lodash';
import AppAccordion from "./AppAccordion.vue";
import { jwtDecode } from "jwt-decode";
import { format } from 'date-fns';
import Modal from './Modal.vue';

</script>

<template>
  <div class="mt-3">
    <div class="font-semibold text-xl">Prerequisite</div>
    <p>Before starting, please make sure : </p>
    <ul>
      <li class="pl-3">1 - To be connected to VPN Checkout</li>
      <li class="pl-3">2 - To use a valid bearer token</li>
    </ul>
  </div>
  <hr class="mb-2 mt-2">
  <div id="catAdminForm">
    <ul v-if="error">
      <div class="relative text-white px-6 py-4 border-0 rounded mb-2 mt-4" :class="color">
        <span class="text-xl inline-block mr-5 align-middle">
          <i class="fas fa-bell"></i>
        </span>
        <span class="inline-block align-middle mr-8">
          <b class="capitalize">{{errorType}} : </b>{{ error }}  
        </span>
        <button class="absolute bg-transparent text-2xl font-semibold leading-none top-50 end-0  mr-6 outline-none focus:outline-none" @click="closeAlert()">
          <span>×</span>
        </button>
      </div>
      <!-- <li :style="{ color: `red` }">Error: {{ error }}</li> -->
    </ul>
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
      <input v-model="ClientId" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" placeholder="cli_xxx" />
    </div>

    <div class="form-row">
      <label for="field2">Delay (in ms):</label>
      <input v-model="delay" placeholder="ex : 10000 ms" type="text" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
    </div>

    <button class="bg-blue-500 text-white active:bg-black-600 font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" @click="getClientId()">
      Find
    </button>

    <br />
    <ul v-if="isLoading">
      <loading v-model:active="isLoading" :color="'#186AFF'" :loader="'bars'" :height="50" :width="50" :can-cancel="false"
        :is-full-page="false" />
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
              <input type="text" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" placeholder="Name" :hidden="(entity.EntityID?.length > 0)"
                v-model="entity.EntityName" required/>
            </div>
            <div class="form-row pl-2" :hidden="(entity.EntityID?.length > 0)">
              <label>Legal entity: </label>
              <select v-model="entity.LegalEntity" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full">
                <option v-for="(item, index) in legalEntityList" 
                  :value="item" 
                  :key="index">
                    {{item}}
                </option>
            </select>
            </div>


            <!-- <div v-for="(processingChannel, pID) in entity.Processing_channel"> -->
            <div v-for="(channel, pID) in entity.Processing_channel" :key="channel.ProcessingChannelID">
              <div class="processing ml-10">
                <div class="form-row">
                  <label>{{ pID + 1 }} - ProcessingChannel ({{ channel.ProcessingChannelID }}): </label>
                  <input type="text" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" placeholder="Name"
                    :disabled="(channel.ProcessingChannelID?.length > 0)" v-model="channel.ProcessingChannelName" required/>
                </div>
                <div class=" ml-10">
                  <p>Payment Method : </p>
                  <div class="paymentMethods ml-10">
                    <div v-for="method in paymentMethods" :key="method.id">
                      <input type="checkbox" :checked="isChecked(method.id, channel.ProcessingChannelID)"
                        :disabled="isDisabled(method.id, channel.ProcessingChannelID)"
                        @change="toggleCheckbox(method.id, eID, pID)" :value="method.id" />
                      <label>{{ ' ' + method.name }}</label>
                    </div>
                  </div>
                </div>
              </div>
              <hr class="small_hr" />
            </div>

            <button class="bg-blue-500 text-white active:bg-black-600 font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" @click="addNewProcessingChannel(eID)">
              Add processing channel
            </button>
          </template>
        </app-accordion>
      </div>

    </ul>
    <button class="bg-blue-500 text-white active:bg-black-600 font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" @click="addNewEntity">
      Add an entity
    </button>

    <br />
    <button class="bg-blue-500 text-white active:bg-black-600 font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="createEntities">Submit</button>
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

select {
  width: 100%;
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

input:invalid {
  background-color: #ffdddd;
}


input:required:invalid {
  border: 1px solid #c00000;
}

input:required:valid {
  border: 1px solid #ccc;
  background-color: #fff;
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
      Bearer: "eyJraWQiOiJtTlpYdXhvUjVpTWN2OGVFdm1kUnlnd3JHSjIxVlJPb1BFUjhiREdidG4wIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmpGaXYtbHpWOEtpc1ZxMnlSSWZTM21SajlkcmxtV2dOUTBaZFRUUmtPblEiLCJpc3MiOiJodHRwczovL2NoZWNrb3V0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzc2t1ajN4YUNCN0ZUMmcwaDciLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzA3Mzg4ODIwLCJleHAiOjE3MDczOTI0MjAsImNpZCI6IjBvYXNrdHowMG5vTjVjQTV4MGg3IiwidWlkIjoiMDB1MWNmbHRvcHZ0c21xUDEwaDgiLCJzY3AiOlsib3BlbmlkIiwiY2xpZW50YWRtaW4tdG9vbCIsInByb2ZpbGUiXSwiYXV0aF90aW1lIjoxNzA3Mzg4ODE3LCJzdWIiOiJmcmFuY29pcy5mYWxjb25ldEBjaGVja291dC5jb20iLCJmdWxsX25hbWUiOiJGcmFuw6dvaXMgRmFsY29uZXQiLCJjYXQtZ3JvdXBzIjpbIkFwcC5BdGxhcy5DQVQuU2FuZGJveC5TdXBwb3J0Il19.dWekjJcQ8uk420Q3j6Ih3nZZJFDdc4XH5zSpyMrI1WjTq5FtfYslC-SKWxns7UuF9j9d2ERX7G81uqLlKlSONkV0QRZkIPxdF3Bgq_kJP1dEt_ma5rA6SbDoBU67WiqhRjv0OQ47BSbp12sOhJKWN-pbToAt9D_46RsFUoJba6gvnF4h8pJfarBicC9QyHo9FbpC87GAQNJoMjIrzeDKL9xMU7lGJ4DHoIwOIMT0TbFvPRzbFqUnh-NcpMslZ620xBY3yuaordpDFzXfczdQ2tbh96ZxxfehD9lMf2ZVb2gCYOahzHCBOjaRn-4VE3IFsrTB1-v06keoCUarpoxJ0A",
      ClientId: "cli_lggnvyogtibehexpagb2ydx6k4",
      delay: "1000",
      Entity: [],
      InitalEntity: [],
      newEntity: [],
      isLoading: false,
      error: '',
      errorType: '',
      color:'bg-blue-500',
      legalEntityList: ['cko-ltd-uk', 'cko-sas'],
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
    closeAlert() {
      this.error = '';
      this.errorType = '';
    },
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
      this.error = '';
      this.errorType = '';
      this.Entity.push({
        EntityID: "",
        EntityName: "",
        LegalEntity: "cko-ltd-uk",
        Processing_channel: [{
          ProcessingChannelID: "",
          ProcessingChannelName: "",
          PaymentMethod: [],
        }],
      });
      this.newEntity.push({
        EntityID: "",
        EntityName: "",
        LegalEntity: "cko-ltd-uk",
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

      this.error='';
      this.errorType = '';

      if (!(this.status === 'OK')) {
        this.errorType = 'WARNING';
        this.color = 'bg-blue-500';
        this.error = 'Please use a valid token';
        return;
      }
      if (!this.ClientId?.length > 0 ) {
        this.errorType = 'WARNING';
        this.color = 'bg-blue-500';
        this.error = 'Please indicate a Client ID';
        return;
      }

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

      const errors = await validatePayload(newPayload);

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


      if (errors?.length >  0) {
        this.errorType = 'WARNING'
        this.error = errors
      } else {

        // Payload is correct, we can send the data
        this.isLoading = true;
        this.error = '';
        this.errorType = ''

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
            //const result = checkEntity(res.data);
            const result = res?.data?.Entity.map((entity) => checkEntity(entity));

            if (result && !areAllObjectsEmpty(result)) {
              this.errorType = 'WARNING';
              this.color = 'bg-blue-500';
              this.error = displayMessage(result)
            } else {
              this.errorType = 'SUCCESS';
              this.color = 'bg-green-500';
              this.error = "Operation Complete. All Entities, processing Channels, payments Methods have been correctly configured"
            }
            /*this.isLoading = false;
            this.isLoading = true;
            this.getClientId();*/
          })
          .catch((error) => {
            console.log("error", error);
            this.errorType = 'ERROR';
            this.color = 'bg-red-500';
            this.error = error.message || 'Error occurred while fetching user info';
            this.isLoading = false;
          })
          .finally(() => {
            this.isLoading = false;
            this.Entity = [];
            this.InitalEntity = [];
            this.newEntity = [];
            //Perform action in always
          });
        }
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
    toggleCheckbox(methodId, eID, pID) {
      
      if (!this.newEntity || !this.newEntity.length) {
        return;
      }

      if(this.newEntity[eID] && this.newEntity[eID].Processing_channel[pID]) {
        const index = this.newEntity[eID].Processing_channel[pID].PaymentMethod.indexOf(methodId);
        if (index === -1) {
          this.newEntity[eID].Processing_channel[pID].PaymentMethod.push(methodId);
        } else {
          this.newEntity[eID].Processing_channel[pID].PaymentMethod.splice(index, 1);
        }
      }
      console.log(this.newEntity);
    },
    async getClientId() {
      
      this.error = '';
      this.errorType = '';

      if (!(this.status === 'OK')) {
        this.errorType = 'WARNING';
        this.color = 'bg-blue-500';
        this.error = 'Please use a valid token';
        return;
      }

      if (!this.ClientId?.length > 0 ) {
        this.errorType = 'WARNING';
        this.color = 'bg-blue-500';
        this.error = 'Please indicate a Client ID';
        return;
      }

      this.isLoading = true;
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
            this.errorType = 'WARNING';
            this.color = 'bg-blue-500';
            this.error = `No merchant found in sandbox with this ${this.ClientId}`;
            this.isLoading = false;
          }
        })
        .catch((error) => {
          this.Entity = []
          this.errorType = 'ERROR';
          this.color = 'bg-red-500';
          this.error = error?.response?.data?.Message || 'Error occurred while fetching user info';
          this.isLoading = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  },
};

async function validatePayload(data) {

  let errors = [];
  console.log(data);

  if (!Array.isArray(data)) {
    errors.push("Invalid data format. Expecting an array of entities.");
  }

  if (data?.length === 0)
    errors.push('You cannot send empty data');
  
  for (let i = 0; i < data.length; i++) {
    const entity = data[i];

    // Check if "EntityName" is empty
    if (!entity.EntityName.trim()) {
      errors.push(`Entity n°${i} has an empty EntityName.`);
    }

    // Check each processing channel
    const processingChannels = entity.Processing_channel;
    for (let j = 0; j < processingChannels.length; j++) {
      const processingChannel = processingChannels[j];

      // Check if "ProcessingChannelName" is empty
      if (!processingChannel.ProcessingChannelName.trim()) {
        errors.push(`In the entity [${entity.EntityName}], the processing channel n°${j} has an empty ProcessingChannelName.`);
      }
    }
  }

  return errors;
}


// Function to check if all required conditions are met at the Entity level
function checkEntity(entity) {
  console.log(entity)
    //const status = entity.status;
    let finalResult = {};

     entity.Processing_Channel.map((channel) => {

        const currencyAccountSetup = channel.CurrencyAccountSetup?.CURRENCY_ACCOUNT;
        const paymentRoutingRulesSetup = channel.PaymentRoutingRulesSetup?.PAYMENT_ROUTING_RULES;
        const createRoutingPayoutRules = channel.CreateRoutingPayoutRules?.PAYOUT_ROUTING_RULES;
        const payoutScheduleSetup = channel.PayoutScheduleSetup?.PAYOUT_SCHEDULE;

        let nonConfiguredProcessingChannel = {};

        if (currencyAccountSetup && !isSetupConfigured(currencyAccountSetup))
          nonConfiguredProcessingChannel = {...nonConfiguredProcessingChannel, currencyAccount: currencyAccountSetup}

        if (paymentRoutingRulesSetup && !isSetupConfigured(paymentRoutingRulesSetup))
          nonConfiguredProcessingChannel = {...nonConfiguredProcessingChannel, paymentRoutingRules: paymentRoutingRulesSetup}

        if (createRoutingPayoutRules && !isSetupConfigured(createRoutingPayoutRules))
          nonConfiguredProcessingChannel = {...nonConfiguredProcessingChannel, createRoutingPayoutRules: createRoutingPayoutRules}

        if (payoutScheduleSetup && !isSetupConfigured(payoutScheduleSetup))
          nonConfiguredProcessingChannel = {...nonConfiguredProcessingChannel, payoutSchedule: payoutScheduleSetup}

        //return nonConfiguredProcessingChannel;
        let nonConfiguredPaymentMethods = {};
        const paymentMethod = channel.Payment_Method;
        console.log('channel Payment Method: ', paymentMethod)
        

        if (paymentMethod?.CARTES_BANCAIRESSetup && !isPaymentMethodConfigured(paymentMethod?.CARTES_BANCAIRESSetup?.Status)) {
          nonConfiguredPaymentMethods = {...nonConfiguredPaymentMethods,  CARTES_BANCAIRES: '('+ channel.Processing_Channel_ID +') ' + paymentMethod.CARTES_BANCAIRESSetup?.Status + ' ' + paymentMethod.CARTES_BANCAIRESSetup?.Processing_profile}
        }
        if (paymentMethod[0]?.MASTERCARDSetup && !isPaymentMethodConfigured(paymentMethod[0]?.MASTERCARDSetup?.Status)) {
          nonConfiguredPaymentMethods = {...nonConfiguredPaymentMethods,  MASTERCARD: '('+ channel.Processing_Channel_ID +') ' + paymentMethod[0].MASTERCARDSetup?.Status + ' ' + paymentMethod[0].MASTERCARDSetup?.Processing_profile}
        }
        if (paymentMethod[0]?.VISASetup && !isPaymentMethodConfigured(paymentMethod[0]?.VISASetup?.Status)) {
          nonConfiguredPaymentMethods = {...nonConfiguredPaymentMethods,  VISA: '('+ channel.Processing_Channel_ID +') ' + paymentMethod[0].VISASetup?.Status + ' ' + paymentMethod[0].VISASetup?.Processing_profile}
        }
        if (paymentMethod[0]?.IDEALSetup &&  !isPaymentMethodConfigured(paymentMethod[0]?.IDEALSetup?.Status)) {
          nonConfiguredPaymentMethods = {...nonConfiguredPaymentMethods,  IDEAL: '('+ channel.Processing_Channel_ID +') ' + paymentMethod[0].IDEALSetup?.Status + ' ' + paymentMethod[0].IDEALSetup?.Processing_profile}
        }
        if (paymentMethod[0]?.BANCONTACTSetup && !isPaymentMethodConfigured(paymentMethod[0]?.BANCONTACTSetup?.Status)) {
          nonConfiguredPaymentMethods = {...nonConfiguredPaymentMethods,  BANCONTACT: '('+ channel.Processing_Channel_ID +') ' + paymentMethod[0].BANCONTACTSetup?.Status + ' ' + paymentMethod[0].BANCONTACTSetup?.Processing_profile}
        }
        if (paymentMethod[0]?.SEPASetup && !isPaymentMethodConfigured(paymentMethod[0]?.SEPASetup?.Status)) {
          nonConfiguredPaymentMethods = {...nonConfiguredPaymentMethods,  SEPA: '('+ channel.Processing_Channel_ID +') ' + paymentMethod[0].SEPASetup?.Status + ' ' + paymentMethod[0].SEPASetup?.Processing_profile}
        }

        if(!isObjectEmpty(nonConfiguredProcessingChannel)){
          finalResult = {...finalResult, nonConfiguredProcessingChannel}
        }

        if(!isObjectEmpty(nonConfiguredPaymentMethods)) {
          finalResult = {...finalResult, nonConfiguredPaymentMethods}
        }
  })

  return finalResult;
}

// Function to check if CARTES_BANCAIRESSetup or MASTERCARDSetup is configured
function isPaymentMethodConfigured(paymentMethod) {
    return paymentMethod === 'CONFIGURED';
}

// Function to check if CurrencyAccountSetup, PaymentRoutingRulesSetup, CreateRoutingPayoutRules, and PayoutScheduleSetup are configured
function isSetupConfigured(setup) {
    return setup === 'CONFIGURED';
}

function isObjectEmpty (objectName) {
  if (objectName === null || objectName === undefined)
    return true;
  else 
  if (Object.keys(objectName).length === 0) 
    return true;
  else
    return false;
}

function areAllObjectsEmpty(array) {
  for (let obj of array) {
    if (Object.keys(obj).length !== 0) {
      return false; // If any object is not empty, return false
    }
  }
  return true; // All objects are empty
}

function displayMessage(message) {
  let result = [];
  message.forEach(item => {
    Object.entries(item.nonConfiguredPaymentMethods).forEach(([key, value]) => {
        result.push(`${key}: ${value}`);
    });
});

const concatenatedString = 'Operation partially Complete. All was good and created excepted for that : \n'   + result.join('\n');
return concatenatedString;
}

</script>
