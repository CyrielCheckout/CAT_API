const axios = require('axios');
//const baseURL = "https://client-admin.cko-prod.ckotech.co/";
//const hostURL = baseURL.replace('https://', '').replace('/','');
const ErrorHandling = require('../Error');

async function GetAllProcessingChannels(bearer, EntityID) {
  try {
    GetAllProcessingChannelsfunc = await axios({
      method: 'get',
      url: baseURL + 'api/entities/' + EntityID + '/processing-channels?limit=25&skip=0&partialName=',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      }
    })
      .then(function (response) {
        return response
      });
    return GetAllProcessingChannelsfunc;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetAllProcessingChannels");
  }
}
async function GetProcessingChannelConf(bearer, ClientId, EntityID, ProcessingChannelId) {
  try {
    GetProcessingChannelConffunc = await axios({
      method: 'get',
      url: baseURL + 'api/processing-channels/' + ProcessingChannelId,
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'Cko-Client-Id': ClientId,
        'cko-entity-id': EntityID,
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      }
    })
      .then(function (response) {
        return response
      });
    return GetProcessingChannelConffunc;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetProcessingChannelConf");
  }
}
async function CreateProcessingChannel(bearer, EntityID, Payload) {
  try {
    CreateProcessingChannelfunc = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/processing-channels',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL,
        keepAlive: true
      },
      data: Payload,
      timeout: 20000
    })
      .then(function (response) {
        return response
      });

    return CreateProcessingChannelfunc;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "CreateProcessingChannel");
  }
}
async function CreateAPMProcessingProfile(bearer, EntityID, Payload) {
  try {
    Create_Processing_profile_Bancontact_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/processing-profiles/v2',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data:Payload,
      timeout:2000
    })
      .then(function (response) {
        return response
      });

    return Create_Processing_profile_Bancontact_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(er, "Create_Processing_profile_Bancontact");
  }
}
async function Create_Card_Processing_profile(bearer, EntityID, Payload) {
  try {
    Create_Processing_profile_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/processing-profiles/v2',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data: Payload,
      timeout : 10000
    })
      .then(function (response) {
        return response
      });
    return Create_Processing_profile_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Create_Processing_profile");
  }

}
async function Create_GatewayProcessor(bearer, ProcessingChannelId, Payload) {
  try {
    Create_GatewayProcessor_func = await axios({
      method: 'post',
      url: baseURL + 'api/processing-channels/' + ProcessingChannelId + '/processors',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data: Payload,
      timeout : 2000
    })
      .then(function (response) {
        return response
      });
    return Create_GatewayProcessor_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Create_GatewayProcessor");
  }

}
async function Create_AuthenticationProcessor(bearer, ProcessingChannelId, Payload) {
  try {
    Create_GatewayProcessor_func = await axios({
      method: 'post',
      url: baseURL + 'api/session-processing-channels/' + ProcessingChannelId + '/session-profile-processors',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data:Payload,
      timeout : 2000
    })
      .then(function (response) {
        return response
      });
    return Create_GatewayProcessor_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Create_AuthenticationProcessor");
  }

}
async function Create_Currency_Account(bearer, EntityID, ProcessingChannelName, CKOTEMPLATE) {
  try {
    Create_Currency_Account_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/currency-accounts',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data: {
        "name": ProcessingChannelName,
        "custom_id": "",
        "holding_currency": CKOTEMPLATE.currency
      }
    })
      .then(function (response) {
        return response
      });
    return Create_Currency_Account_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Create_Currency_Account");
  }
}
async function Create_Routing_Rules_Payment(bearer, EntityID, ProcessingChannelId, CurrencyAccountID, DefaultRule) {
  try {
    Create_Routing_Rules_Payment_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/payment-routing-rules',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data: {
        "type": "Processing channel - Currency account",
        "revenue_currency_account_id": CurrencyAccountID,
        "fees_currency_account_id": CurrencyAccountID,
        "processing_channel_id": ProcessingChannelId,
        "allow_any_processing_channel": DefaultRule,
        "merchant_category_codes": [],
        "allow_any_merchant_category_code": true,
        "processing_currencies": [],
        "allow_any_processing_currency": true,
        "event_types": [],
        "allow_any_event_type": true
      }
    })
      .then(function (response) {
        return response
      });
    return Create_Routing_Rules_Payment_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Create_Routing_Rules_Payment");
  }
}
async function Create_Routing_Rules_Payout(bearer, EntityID, CurrencyAccountID) {
  try {
    Create_Routing_Rules_Payout_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/payout-routing-rules',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data: {
        "source_identifier": CurrencyAccountID,
        "revenue_currency_account_id": CurrencyAccountID,
        "fees_currency_account_id": CurrencyAccountID
      }
    })
      .then(function (response) {
        return response
      });
    return Create_Routing_Rules_Payout_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Create_Routing_Rules_Payout");
  }
}
async function Create_Payout_Schedules(bearer, EntityID, ProcessingChannelName, CurrencyAccountID, CKOTEMPLATE) {
  try {
    Create_Payout_Schedules_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/payout-settings',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data: {
        "payout_schedule": {
          "name": ProcessingChannelName,
          "threshold_amount": "0",
          "general_frequency_choice": "daily",
          "hours": "2",
          "minutes": "0",
          "weekdays": [],
          "cron_schedule": "0 2 * * 1-5",
          "currency_account_ids": [
            CurrencyAccountID
          ],
          "payment_network": ""
        },
        "payment_instrument": {
          "id": "",
          "date_created": "",
          "vault_account_id": "",
          "instrument_type": "bank_account",
          "address_choice": "same_as_principal",
          "currency_code": CKOTEMPLATE.currency,
          "account_holder_details": {
            "company_name": ProcessingChannelName,
            "address": {
              "line1": CKOTEMPLATE.address_line_1,
              "line2": CKOTEMPLATE.address_line_2,
              "city": CKOTEMPLATE.city,
              "postcode": CKOTEMPLATE.postal_code,
              "country_iso3_code": CKOTEMPLATE.country_code_iso3,
              "state": CKOTEMPLATE.region_code
            }
          },
          "bank_details": {
            "bank_name": "",
            "branch_name": "",
            "address": {
              "line1": "",
              "line2": "",
              "city": "",
              "postcode": "",
              "country_iso3_code": "FRA",
              "state": ""
            },
            "account_type": "",
            "account_number": "",
            "branch_code": "",
            "bank_code": "",
            "iban": "FR7630001007941234567890185",
            "bban": "",
            "swift_bic": "BDFEFR2TXXX"
          },
          "crypto": {
            "account_details": {
              "blockchain": "",
              "currency": ""
            },
            "account_holder_address": {
              "line1": "",
              "line2": "",
              "city": "",
              "postcode": "",
              "state": "",
              "country_iso3_code": ""
            }
          }
        }
      }
    })
      .then(function (response) {
        return response
      });
    return Create_Payout_Schedules_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Create_Payout_Schedules");
  }
}
async function Get_Processing_channel_Session(bearer, EntityID) {
  try {
    Get_Processing_channel_Session_func = await axios({
      method: 'get',
      url: baseURL + 'api/sessions-processing-channels/clone-configuration?entityId=' + EntityID,
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      }
    })
      .then(function (response) {
        return response
      });

    return Get_Processing_channel_Session_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Get_Processing_channel_Session");
  }
}
async function Create_Session_Processing_Channels(bearer, EntityID, Payload) {
  try {
    Create_Session_Processing_Channels_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/sessions-processing-channels',
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data: Payload,
      timeout : 2000
    })
      .then(function (response) {
        return response
      });
    return Create_Session_Processing_Channels_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Create_Session_Processing_Channels");
  }
}
async function Get_Gateway_Processor_Details(bearer, ProcessingChannelId, ProcessorID) {
  try {
    Get_Gateway_Processor_Details_func = await axios({
      method: 'get',
      url: baseURL + 'api/processing-channels/' + ProcessingChannelId + '/processors/' + ProcessorID,
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      }
    })
      .then(function (response) {
        return response
      });

    return Get_Gateway_Processor_Details_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Get_Gateway_Processor_Details");
  }
}
async function Update_Gateway_Processor(bearer, ProcessingChannelId, ProcessorID, Payload) {
  try {
    Update_Gateway_Processor_func = await axios({
      method: 'put',
      url: baseURL + 'api/processing-channels/' + ProcessingChannelId + '/processors/' + ProcessorID,
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': 'cli_lkuch7kufapeloqe7aba4vferm',
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      },
      data: Payload
    })
      .then(function (response) {
        return response
      });

    return Update_Gateway_Processor_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Update_Gateway_Processor");
  }
}
module.exports = {
  Create_Card_Processing_profile,
  GetAllProcessingChannels,
  Get_Gateway_Processor_Details,
  Update_Gateway_Processor,
  GetProcessingChannelConf,
  CreateProcessingChannel,
  CreateAPMProcessingProfile,
  Create_Currency_Account,
  Create_Routing_Rules_Payment,
  Create_Routing_Rules_Payout,
  Create_Payout_Schedules,
  Get_Processing_channel_Session,
  Create_Session_Processing_Channels,
  Create_GatewayProcessor,
  Create_AuthenticationProcessor
}