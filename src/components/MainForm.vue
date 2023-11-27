<script setup>

import axios from "axios";
import EntityForm from "./EntityForm.vue";
import _ from 'lodash';

</script>

<template>
  <div id="catAdminForm">
    <h1>CAT Admin Form</h1>

    <span>CAT Bearer Token:</span>
    <p style="white-space: pre-line"></p>
    <textarea
      v-model="Bearer" class="bearer"
      placeholder="Bearer eyJraWQiOiJnSEh6djlqc...."></textarea>

      <div class="form-row">
        <label for="ClientId">Client ID:</label>
        <input v-model="ClientId" class="clientId" placeholder="cli_xxx" />
      </div>
      
      <div class="form-row">
        <label for="field2">Delay (in ms):</label>
        <input v-model="delay" placeholder="ex : 10000 ms" />
      </div>

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

</style>

<script>
export default {
  data() {
    return {
      Bearer:
        "Bearer eyJraWQiOiJnSEh6djlqcUxFZTc3dVV2Mkhld19BUEZabUdsaEhDZVVldXVQUjhMQUQwIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULk9nS0VpaWd1LWV5Z3hzSU11QUM1T3ZrQTV4UE4tajdhaHp4UGxoOHFOZXciLCJpc3MiOiJodHRwczovL2NoZWNrb3V0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzc2t1ajN4YUNCN0ZUMmcwaDciLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzAwNjgyNTE5LCJleHAiOjE3MDA2ODYxMTksImNpZCI6IjBvYXNrdHowMG5vTjVjQTV4MGg3IiwidWlkIjoiMDB1MWNmbHRvcHZ0c21xUDEwaDgiLCJzY3AiOlsicHJvZmlsZSIsImNsaWVudGFkbWluLXRvb2wiLCJvcGVuaWQiXSwiYXV0aF90aW1lIjoxNzAwNjgyNTE2LCJzdWIiOiJmcmFuY29pcy5mYWxjb25ldEBjaGVja291dC5jb20iLCJmdWxsX25hbWUiOiJGcmFuw6dvaXMgRmFsY29uZXQiLCJjYXQtZ3JvdXBzIjpbIkFwcC5BdGxhcy5DQVQuU2FuZGJveC5TdXBwb3J0Il19.MVkAu2u-O4cfAvpyaFZhx7MW4aCckVxSYWaWJyF96k0Po0SIxSIqFnOPoBp89la3mdtRE8rbgJR3fwU0WBROxc_f71kYxJ-RJBjjVnpu9r1Az769kzNfJLxbTJ86T5h4jSYYGi81-3hqejZf4UGkGOr_jMLwzrB8tbTD3_POJ5xvq8ImEU7Fd632fK-ti746WkYmbbxSl4b89Rc3GwQB37aVwtoLUfFqqftHrnqeNZAg0hZ4Onmn5C1X_QBSbWLzd-kMgBdsYnRVLHFOCP-h1tMx5u7syCL8ESdIYXDjtwotJHOcsTSXjCMVtb_lL4HOUwUCCXvXuZFgTEu7MVrUvg",
      ClientId: "cli_d2s6xmrsuezerh3uvt2utdui24",
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
  methods: {
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

console.log(Entity);


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
</script>
