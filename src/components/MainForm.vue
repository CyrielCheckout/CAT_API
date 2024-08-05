<script setup>

import axios from "axios";
import _ from 'lodash';
import AppAccordion from "./AppAccordion.vue";
import { jwtDecode } from "jwt-decode";
import { format } from 'date-fns';
import authService from '../scripts/authService';
import pathToVisaLogo from '../assets/visa.png'
import pathToMastercardLogo from '../assets/mastercard.png'
import pathToAmexLogo from '../assets/amex.png'
import pathToCBLogo from '../assets/cb.png'
import pathToIdealLogo from '../assets/Ideal.png'
import pathToBancontactLogo from '../assets/bancontact.png'
import pathToSepaLogo from '../assets/sepa.jpg'
import pathToGiropayLogo from '../assets/giropay.png'
import VueTree from "@ssthouse/vue3-tree-chart";
import "@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css";

import { defineComponent } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';
import { CustomerService } from '../service/CustomerService';
import { SANDBOX, PRODUCTION, CLIENT_ID_PRODUCTION } from '../constants';

</script>

<template>
  <div v-if="!status" class="mt-10" style="border-radius:10px;background-color:#e8e8e8;text-align:center">

    <!-- <p class="pt-4">1 - Please select your environment</p>
    <button 
      :class="['toggle-button', 'sandbox', env === SANDBOX ? 'active' : '']" 
      @click="updateEnv(SANDBOX)">
      Sandbox
    </button>
  
    <button 
      :class="['toggle-button', 'prod', env === PRODUCTION ? 'active' : '']" 
      @click="updateEnv(PRODUCTION)">
      Production
    </button> -->


    <!-- <p class="pt-4">2 - Please authenticate via Okta to proceed in <span style="color: red;"><b>{{ env }}</b></span></p> -->
    <p class="pt-4 mb-3">Please authenticate via Okta to proceed in <b>Sandbox</b></p>
    <button class="bg-blue-500 text-white active:bg-black-600 font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" @click="generateToken(env)">Authenticate</button>
    <p class="p-4">📝 Please ensure you have <a href="https://checkoutsupport.freshservice.com/support/catalog/items/302" target="_blank"><u><i>access to CAT</i></u></a></p>
  </div>

  
  <div v-else id="catAdminForm">
    <!--<DataTable :value="logs" :rows="10" responsiveLayout="scroll">
      <Column field="timestamp" header="Timestamp" sortable></Column>
      <Column field="level" header="Level" sortable></Column>
      <Column field="message" header="Message" sortable></Column>
      <Column field="source" header="Source" sortable></Column>
      <Column field="user" header="User" sortable></Column>
      <Column field="CorrelationID" header="Correlation ID" sortable></Column>
      <Column field="PID" header="PID" sortable></Column>
      <Column field="CATENV" header="Environment" sortable></Column>
    </DataTable>-->
    <!-- <DataTable v-model:filters="filters" :value="logs" paginator :rows="10" dataKey="id" filterDisplay="row" :loading="loading"
                :globalFilterFields="['timestamp', 'level']">
            <template #header>
                <div class="flex justify-content-end">
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
                    </IconField>
                </div>
            </template>
            <template #empty> No logs found. </template>
            <template #loading> Loading logs data. Please wait. </template>
            <Column field="timestamp" header="Timestamp" style="min-width: 12rem">
                <template #body="{ timestamp }">
                    {{ timestamp }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by name" />
                </template>
            </Column>
            <Column header="Level" filterField="level" style="min-width: 12rem">
                <template #body="{ level }">
                    <div class="flex align-items-center gap-2">
                        
                        <span>{{ level }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by country" />
                </template>
            </Column>
            <Column field="message" header="Message" sortable></Column>
      <Column field="source" header="Source" sortable></Column>
      <Column field="user" header="User" sortable></Column>
      <Column field="CorrelationID" header="Correlation ID" sortable></Column>
      <Column field="PID" header="PID" sortable></Column>
      <Column field="CATENV" header="Environment" sortable></Column>
        </DataTable> -->
    
    <ul v-if="error">
      <div class="relative text-white px-6 py-4 border-0 rounded mb-2 mt-4" :class="color">
        <span class="text-xl inline-block mr-5 align-middle">
          <i class="fas fa-bell"></i>
        </span>
        <span  class="inline-block align-middle mr-8">
          <b class="capitalize">{{errorType}} : </b><span v-html="error" ></span>  
        </span>
        <button class="absolute bg-transparent text-2xl font-semibold leading-none top-50 end-0  mr-6 outline-none focus:outline-none" @click="closeAlert()">
          <span>×</span>
        </button>
      </div>
      <!-- <li :style="{ color: `red` }">Error: {{ error }}</li> -->
    </ul>
    <div class="pt-4" :style="{ color: `${messageColor}` }">Status: {{ status }} - Username: {{ username }} - Expiry Time: {{
      expiryTime }}</div>

    <hr class="mb-2 mt-2">

    <div class="mt-6 form-row">
      <label for="ClientId">Client ID:</label>
      <input v-model="ClientId" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" placeholder="cli_xxx" required />
    </div>

    <div class="form-row">
      <label for="field2">Delay (in ms):</label>
      <input v-model="delay" placeholder="ex : 10000 ms" type="text" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full"/>
    </div>

    <button class="bg-green-400 text-white active:bg-black-600 font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" @click="getClientId()">
      Find
    </button>

    <br />
    <ul v-if="isLoading">
      <loading v-model:active="isLoading" :color="'#186AFF'" :loader="'bars'" :height="50" :width="50" :can-cancel="false"
        :is-full-page="false" />
    </ul>
    <ul v-else>
      <div style="display:flex; flex-direction:column">
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
                  <span v-if="!channel.ProcessingChannelID" @click="deleteProcessingChannel(channel, eID, pID)" class="float-right"
                    style="cursor: pointer; margin-left: 10px;margin-top: 4px;">
                    X
                  </span>
                  <div class="form-row">
                    <label>{{ pID + 1 }} - ProcessingChannel ({{ channel.ProcessingChannelID }}): </label>
                    <input type="text" class="px-2 py-1 placeholder-blueGray-300 text-blueGray-600 bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full" placeholder="Name"
                      :disabled="(channel.ProcessingChannelID?.length > 0)" v-model="channel.ProcessingChannelName" required/>
                  </div>
                  <div class=" ml-10">
                    <p>Payment Method : </p>
                    <div class="paymentMethods ml-10">
                      <div v-for="method in paymentMethods" :key="method.id" style="display:flex">
                        <input type="checkbox" :checked="isChecked(method.id, channel.ProcessingChannelID)"
                          :disabled="isDisabled(method.id, channel.ProcessingChannelID)"
                          @change="toggleCheckbox(method.id, eID, pID)" :value="method.id" />
                        <!-- <label>{{ ' ' + method.name }}</label> -->
                        <img class="pl-2" style="margin:auto;" :src="method.img" alt="" height=35 width=50 />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div style="float:right">
              <button  class="bg-blue-500 text-white active:bg-black-600 font-bold text-sm px-4 py-2 mt-4 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" @click="addNewProcessingChannel(eID)">
                Add processing channel
              </button>
            </div>
            </template>
          </app-accordion>
        </div>
      </div>
    </ul>
    <div style="float:right">
    <button v-if="ClientFound" class="bg-blue-500 text-white active:bg-black-600 font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" @click="addNewEntity">
      Add an entity
    </button>
    </div>

    <br />
    <button v-if="ClientFound" class="bg-green-400 text-white active:bg-black-600 font-bold text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="createEntities">Submit</button>

    <app-accordion v-if="Object.keys(richMediaData).length > 0" :is-open="false" class="mb-1 mt-4">
      <template v-slot:title>
        <h4 class="card-title pl-2 pr-2" style="font-weight: lighter; justify-content: center;">
         ⬇️ 📊 "Graphic view" of Account Structure (Read Only) ⬇️ 
        </h4>
      </template>
      <template v-slot:content>
        <vue-tree
          style="width: 1000px; height: 1000px; border: 1px solid gray;"
          :direction="treeDirection"
          :dataset="richMediaData"
          :config="treeConfig"
          :collapse-enabled="true"
        >
          <template v-slot:node="{ node, collapsed }">
            <div
              class="rich-media-node"
              :style="{ border: collapsed ? '2px solid #30ec30' : '' }"
            >

            <div v-if="node.avatar !== undefined">
              <img
                :src="node.avatar"
                style="width: 40px; height: 30px; border-radius: 4px;"
              /> 
            </div>
            <div v-else>
              <span style="font-size: 12px; font-weight: bold;"
                >{{ node.name }}</span> <!--  - {{ node.value }}</span> -->
            </div>
            </div>
          </template>
        </vue-tree>
        </template>
        </app-accordion>
  </div>
</template>

<style>
@import 'primevue/resources/themes/saga-blue/theme.css';
@import 'primevue/resources/primevue.min.css';

.toggle-button {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 5px;
  color: rgb(0, 0, 0);
  border: none;
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
  border: 1px solid grey;
  width: 8rem;
}
.sandbox {
  background-color: #ffffff;
}
.prod {
  background-color: #ffffff;
}
.active {
  border-bottom: 2px solid blue;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-slot {
  width: 150px !important;
}

.rich-media-node {
  width: 200px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  color: white;
  background-color: #3b82f6;
  border-radius: 4px;
}
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

const filters = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    timestamp: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    level: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
};

const logsll = [
        {
    "timestamp": "2024-06-03 09:59:54.024",
    "level": "info",
    "message": "Get Vault ID",
    "source": "Createconf_GetVaultID",
    "user": "François Falconet",
    "CorrelationID": "74ef9253-525a-413b-b531-df3b3d141673",
    "PID": 76479,
    "CATENV": "Sandbox"
  },
  {
    "timestamp": "2024-06-03 09:59:54.090",
    "level": "info",
    "message": "Vault ID = vact_mmtxoo2nuametf7xulybzyhybm",
    "source": "Createconf_GetVaultID",
    "user": "François Falconet",
    "CorrelationID": "74ef9253-525a-413b-b531-df3b3d141673",
    "PID": 76479,
    "CATENV": "Sandbox"
  },
  {
    "timestamp": "2024-06-03 09:59:54.091",
    "level": "info",
    "message": "Creating entity :Douglas DC-8-72 with legal entity :cko-sas",
    "source": "NewEntity",
    "user": "François Falconet",
    "CorrelationID": "74ef9253-525a-413b-b531-df3b3d141673",
    "PID": 76479,
    "CATENV": "Sandbox"
  }
];

export default {
  data() {
    return {
      filters: {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                timestamp: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                level: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
            },
            loading: true,
      logs : logsll,
      env: SANDBOX,
      richMediaData: {},
      treeConfig: { nodeWidth: 60, nodeHeight: 100, levelHeight: 200 },
      treeDirection : "horizontal",
      messageColor: "",
      username: "",
      expiryTime: "",
      status: false,
      Bearer: '',
      ClientId: '',
      ClientFound: false,
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
          id: 'VISA',
          name: "Visa",
          img: pathToVisaLogo
        },
        {
          id: 'MASTERCARD',
          name: "Mastercard",
          img: pathToMastercardLogo
        },
        {
          id: 'AMEX',
          name: "Amex",
          img: pathToAmexLogo
        },
        {
          id: 'CARTES_BANCAIRES',
          name: "Cartes Bancaires",
          img: pathToCBLogo
        },
        {
          id: 'IDEAL',
          name: "Ideal",
          img: pathToIdealLogo
        },
        {
          id: 'BANCONTACT',
          name: "Bancontact",
          img: pathToBancontactLogo
        },
        {
          id: 'SEPA',
          name: "Sepa",
          img: pathToSepaLogo
        },
        {
          id: 'GIROPAY',
          name: "Giropay",
          img: pathToGiropayLogo
        }
      ],
    };
  },
  components: {
    DataTable,
    Column
  },
  mounted() {
    this.Bearer = authService.getAccessToken();
    //this.Bearer = 'eyJraWQiOiJVVGI3bUk5aFgzYjBEOUVEMmxldjlZS2t1U1ZfTFAwSXNsZmVJZ2hZb2RNIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULlFpTmVfdzI3ZjVaQVhBeG50cnBCel9jVGRCbEM2M2RIVzU1WmMxelJVXzgiLCJpc3MiOiJodHRwczovL2NoZWNrb3V0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzc2t1ajN4YUNCN0ZUMmcwaDciLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzE4NTY1MzM2LCJleHAiOjE3MTg1Njg5MzYsImNpZCI6IjBvYXNrdHowMG5vTjVjQTV4MGg3IiwidWlkIjoiMDB1MWNmbHRvcHZ0c21xUDEwaDgiLCJzY3AiOlsib3BlbmlkIiwicHJvZmlsZSIsImNsaWVudGFkbWluLXRvb2wiXSwiYXV0aF90aW1lIjoxNzE4NTY1MzM0LCJzdWIiOiJmcmFuY29pcy5mYWxjb25ldEBjaGVja291dC5jb20iLCJmdWxsX25hbWUiOiJGcmFuw6dvaXMgRmFsY29uZXQiLCJjYXQtZ3JvdXBzIjpbIkFwcC5BdGxhcy5DQVQuU2FuZGJveC5TdXBwb3J0Il19.u7PTZHJjS9IiBTcx5pv1qkkxRN0jRj9ugr4gEXqs9Ds3zwI15MO_96V310BDcJYdHS2g-s5sw3pP8Fg8Zppv7opdGWwhPWMky_DP7O8NEooUypiEiWHiLGAD7Y8aVMIgOdln6o-mpTWMQDE0ffUQ-Y1rkRTWGF-A0l7K2gIkiXrrYNS_vsPJeQnI_luAKLm-o8lKUZUgDUNyuz0z_Yw5j23Djf4vn9TgXYVM1cSSf8S0rQhKb7IIAduFzPp3PCbc3k4tZOjrxFnP36VZ5gREIcRb9otT7IXOtLC3XE0OhyBMwxw5Irj6dSuE8wq55lZUicOfJ3k1GvgPqCrlDfuV_Q';
    if (this.Bearer)
      this.decryptBearerToken()

      //this.logs = logsll;
      //this.loading = false;
      /*CustomerService.getCustomersMedium().then((data) => {
            this.customers = this.getCustomers(data);
            this.loading = false;
        });*/
  },
  methods: {
    /*getCustomers(data) {
            return [...(data || [])].map((d) => {
                d.date = new Date(d.date);

                return d;
            });
        },
        formatDate(value) {
            return value.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        formatCurrency(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        },
        getSeverity(status) {
            switch (status) {
                case 'unqualified':
                    return 'danger';

                case 'qualified':
                    return 'success';

                case 'new':
                    return 'info';

                case 'negotiation':
                    return 'warning';

                case 'renewal':
                    return null;
            }
        },*/
    updateEnv(value) {
      this.env = value;
      this.$emit('update-env', value);
    },
    closeAlert() {
      this.error = '';
      this.errorType = '';
    },
    decryptBearerToken() {
      try {
        const decoded = jwtDecode(this.Bearer);
        let now = new Date().getTime();
        let expiryDate = decoded.exp * 1000;
        this.username = decoded.full_name;
        this.expiryTime = format(expiryDate, 'dd/MM/yyyy HH:mm:ss');

        switch(decoded.cid) {
          case CLIENT_ID_PRODUCTION:
            console.log('Prod')
            this.env = PRODUCTION;
            break;
          default : 
            console.log('Sandbox')
            this.env = SANDBOX;
        }

        if (now < expiryDate) {
          this.messageColor = 'green';
          this.status = true
        } else {
          this.messageColor = 'red';
          this.status = false
        }
      } catch (error) {
        console.log(error);
        this.messageColor = 'red';
        this.username = "N/A"
        this.expiryTime = "N/A"
        this.status = false
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
    deleteProcessingChannel(channel, eID, pID) {
      console.log(channel, eID, pID);
      this.Entity[eID].Processing_channel.splice(pID, 1);
      this.newEntity[eID].Processing_channel.splice(pID, 1);
    },
    async createEntities() {

      let environment = SANDBOX;

      this.error='';
      this.errorType = '';

      if (!(this.status)) {
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
      if (errors?.length >  0) {
        this.errorType = 'ERROR'
        this.color = 'bg-red-500';
        this.error = errors
        return;
      }

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

      // Payload is correct, we can send the data
      this.isLoading = true;
      this.error = '';
      this.errorType = ''

      if (this.env === PRODUCTION)
        environment = PRODUCTION;

      await axios
        .request({
          method: "POST",
          maxBodyLength: Infinity,
          url: "https://cat-configuration-helper-bak-sbox.ckotech.co/CatAPI/ConfigureMerchant",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          data: JSON.stringify({
            Bearer: (this.Bearer).toLowerCase().startsWith('bearer') ? (this.Bearer) : 'Bearer ' + (this.Bearer),
            ClientId: this.ClientId,
            delay: this.delay,
            Env: environment,
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
          this.isLoading = true;*/
          
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
          this.getClientId();
        });
        
    },
    getImagePath(img) {
      return imagePaths[img];
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
      
      let environment = SANDBOX;
      //this.error = '';
      //this.errorType = '';

      if (!(this.status)) {
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

      console.log(this.env)
      if (this.env === PRODUCTION) 
        environment = PRODUCTION;

      this.isLoading = true;
      await axios
        .request({
          method: 'POST',
          maxBodyLength: Infinity,
          url: "https://cat-configuration-helper-bak-sbox.ckotech.co/CatAPI/GetMerchantConf",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          data: JSON.stringify({
            Bearer: (this.Bearer).toLowerCase().startsWith('bearer') ? (this.Bearer) : 'Bearer ' + (this.Bearer),
            ClientId: this.ClientId,
            Env: environment
          }),
        })
        .then((res) => {
          //Perform Success Action
          if (res && res.data && res.data.Entity) {
            console.log("res", res.data.Entity);
            let resultEntities = res.data.Entity;

            this.ClientFound = true;

            // build Graphics
            this.richMediaData = convertDataForTreeview(resultEntities, this.paymentMethods);

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
            this.ClientFound = false;
          }
        })
        .catch((error) => {
          let errorMessage;
          if (error?.response?.data?.Error_type && error?.response?.data?.Error_Message?.error_codes) 
            errorMessage = JSON.stringify(error?.response?.data?.Error_type) + ' - ' + JSON.stringify(error?.response?.data?.Error_Message?.error_codes);

          this.Entity = []
          this.errorType = 'ERROR';
          this.color = 'bg-red-500';
          this.error = errorMessage ? errorMessage : 'Error occurred while retrieving merchant account';
          this.isLoading = false;
          this.ClientFound = false;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async generateToken(env) {
      try {
        console.log(env)
        const token = authService.startOAuth(env);
        console.log('Bearer Token:', token);
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
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
      errors.push(`Entity '${i}' has an empty EntityName. <br />`);
    }

    // Check each processing channel
    const processingChannels = entity.Processing_channel;
    for (let j = 0; j < processingChannels.length; j++) {
      const processingChannel = processingChannels[j];

      // Check if "ProcessingChannelName" is empty
      if (!processingChannel.ProcessingChannelName.trim()) {
        errors.push(`In the entity '${entity.EntityName}', the processing channel '${j}' has an empty ProcessingChannelName.<br />`);
      }
    }
  }

  return errors;
}


// Function to check if all required conditions are met at the Entity level
function checkEntity(entity) {
  console.log(entity)
    //const status = entity.status;
    let finalResult = [];

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

        if(!isObjectEmpty(nonConfiguredProcessingChannel)){
          finalResult.push(nonConfiguredProcessingChannel)
        }

        //return nonConfiguredProcessingChannel;
        let nonConfiguredPaymentMethods = [];
        const paymentMethod = channel.Payment_Method;

        console.log('channel Payment Method: ', JSON.stringify(channel))
        

        if (paymentMethod?.CARTES_BANCAIRESSetup && !isPaymentMethodConfigured(paymentMethod?.CARTES_BANCAIRESSetup?.Status)) {
          nonConfiguredPaymentMethods.push('CARTES_BANCAIRES: (' + channel.Processing_Channel_ID +') ' + paymentMethod.CARTES_BANCAIRESSetup?.Status + ' ' + JSON.stringify(paymentMethod.CARTES_BANCAIRESSetup?.Processing_Profile) + ' <br />');
        }
        if (paymentMethod?.MASTERCARDSetup && !isPaymentMethodConfigured(paymentMethod?.MASTERCARDSetup?.Status)) {
          nonConfiguredPaymentMethods.push('MASTERCARD: ('+ channel.Processing_Channel_ID +') ' + paymentMethod.MASTERCARDSetup?.Status + ' ' + JSON.stringify(paymentMethod.MASTERCARDSetup?.Processing_Profile) + ' <br />');
        }
        if (paymentMethod?.VISASetup && !isPaymentMethodConfigured(paymentMethod?.VISASetup?.Status)) {
          nonConfiguredPaymentMethods.push('VISA: ('+ channel.Processing_Channel_ID +') ' + paymentMethod.VISASetup?.Status + ' ' + JSON.stringify(paymentMethod.VISASetup?.Processing_Profile) + ' <br />');
        }
        if (paymentMethod?.AMEXSetup && !isPaymentMethodConfigured(paymentMethod?.AMEXSetup?.Status)) {
          nonConfiguredPaymentMethods.push('AMEX: ('+ channel.Processing_Channel_ID +') ' + paymentMethod.AMEXSetup?.Status + ' ' + JSON.stringify(paymentMethod.AMEXSetup?.Processing_Profile) + ' <br />');
        }
        if (paymentMethod?.IDEALSetup &&  !isPaymentMethodConfigured(paymentMethod?.IDEALSetup?.Status)) {
          nonConfiguredPaymentMethods.push('IDEAL: ('+ channel.Processing_Channel_ID +') ' + paymentMethod.IDEALSetup?.Status + ' ' + JSON.stringify(paymentMethod.IDEALSetup?.Processing_Profile) + ' <br />');
        }
        if (paymentMethod?.BANCONTACTSetup && !isPaymentMethodConfigured(paymentMethod?.BANCONTACTSetup?.Status)) {
          nonConfiguredPaymentMethods.push('BANCONTACT: ('+ channel.Processing_Channel_ID +') ' + paymentMethod.BANCONTACTSetup?.Status + ' ' + JSON.stringify(paymentMethod.BANCONTACTSetup?.Processing_Profile) + ' <br />');
        }
        if (paymentMethod?.SEPASetup && !isPaymentMethodConfigured(paymentMethod?.SEPASetup?.Status)) {
          nonConfiguredPaymentMethods.push('SEPA: ('+ channel.Processing_Channel_ID +') ' + paymentMethod.SEPASetup?.Status + ' ' + JSON.stringify(paymentMethod.SEPASetup?.Processing_Profile) + ' <br />');
        }
        if (paymentMethod?.GIROPAYSetup && !isPaymentMethodConfigured(paymentMethod?.GIROPAYSetup?.Status)) {
          nonConfiguredPaymentMethods.push('GIROPAY: ('+ channel.Processing_Channel_ID +') ' + paymentMethod.GIROPAYSetup?.Status + ' ' + JSON.stringify(paymentMethod.GIROPAYSetup?.Processing_Profile) + ' <br />');
        }

        if(!isObjectEmpty(nonConfiguredPaymentMethods)) {
          finalResult.push(nonConfiguredPaymentMethods);
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
  /*message.forEach(item => {
    if (item?.nonConfiguredPaymentMethods) {
      Object.entries(item.nonConfiguredPaymentMethods).forEach(([key, value]) => {
          result.push(`${key}: ${value}`);
      });
    }*/
    message.forEach(element => {
        if (Array.isArray(element)) {
            result.push(element);
            //printMessages(element);
        } else {
            console.log(element);
        }
    });
//});

const concatenatedString = 'Operation partially Complete. All was good and created excepted for that : <br />'   + result.join('\n');
return concatenatedString;
}

function convertDataForTreeview(inputTable, paymentMethods) {
  const root = {
    name: '🏬 - Client',
    value: inputTable.length, // Count of entities
    children: [] // Holds the list of entities
  };

  inputTable.forEach(entity => {
    const entityNode = {
      name: '🏦 '+ entity.EntityName,
      value: entity.Processing_channel.length, // Count of processing channels
      children: [] // Holds the list of processing channels
    };

    entity.Processing_channel.forEach(channel => {
      const channelNode = {
        name: '🛍️ ' + channel.ProcessingChannelName,
        value: channel.PaymentMethod.length, // Count of payment methods
        children: [] // Holds the list of payment methods
      };

      channel.PaymentMethod.forEach(method => {
        let methodNode;
        let image = paymentMethods.find(methode => methode.id === method)?.img;
        if (image) {
         methodNode = {
            name: method,
            avatar: image
          };
      } else {
        methodNode = {
            name: method,
          };
      }
        channelNode.children.push(methodNode); // Add to channel
      });

      entityNode.children.push(channelNode); // Add to entity
    });

    root.children.push(entityNode); // Add to root
  });

  return root; // Final nested structure
}

</script>
