const axios = require('axios');
const baseURL = "https://client-admin.cko-sbox.ckotech.co/";
//templates for creation
const fs = require('fs/promises')
const path = require('path');
const ckosasTemplate = path.resolve(path.join(__dirname, '../../ConfTemplates/CKOSAS.json'));
const ckoltdTemplate = path.resolve(path.join(__dirname, '../../ConfTemplates/CKOLTD.json'));

async function GetAllEntity(bearer, ClientId, skip) {
  try {
    GetAllEntityfunc = await axios({
      method: 'get',
      url: baseURL + 'api/clients/' + ClientId + '/entities?limit=25&skip=' + skip,
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
        "host": 'client-admin.cko-sbox.ckotech.co'
      }
    })
      .then(function (response) {
        return { status: response.status, body: response.data }
      });
    return GetAllEntityfunc;
  } catch (err) {
    if (err?.response?.data) {

      throw err.response.data
    }
    else if (err.code === "ENOMEM") {

      throw "Connection ERROR"
    }
    else {

      throw err
    }
  }
}
async function CreateEntity(bearer, ClientId, EntityName, CKOTEMPLATE) {
  try {
    CreateEntityfunc = await axios({
      method: 'post',
      url: baseURL + 'api/clients/' + ClientId + '/entities',
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
        "host": 'client-admin.cko-sbox.ckotech.co'
      },
      data: {
        "name": EntityName,
        "doing_business_as": EntityName,
        "registered_business_address": {
          "line1": CKOTEMPLATE.address_line_1,
          "line2": CKOTEMPLATE.address_line_2,
          "city": CKOTEMPLATE.city,
          "postcode": CKOTEMPLATE.postal_code,
          "country_iso3_code": CKOTEMPLATE.country_code_iso3,
          "state": CKOTEMPLATE.region_code
        },
        "is_principal_same_as_registered": true,
        "is_regulated": false,
        "issuer": {
          "type": ""
        },
        "company_number": "99999999999999",
        "tax_number": "",
        "cko_legal_entity": CKOTEMPLATE.CKOLegalEntity,
        "service_provider": "None",
        "onboards_sub_entities": false,
        "referrer": false,
        "processing_urls": [],
        "status": "pending"
      }
    })
      .then(function (response) {
        return response
      });

    return CreateEntityfunc;
  } catch (err) {
    if (err?.response?.data) {

      throw err.response.data
    }
    else if (err.code === "ENOMEM") {

      throw "Connection ERROR"
    }
    else {

      throw err
    }
  }
}
async function GetEntityDetails(bearer, EntityId) {
  try {
    GetEntityDetailsfunc = await axios({
      method: 'get',
      url: baseURL + 'api/processing-channels/configuration?entityId=' + EntityId,
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
        "host": 'client-admin.cko-sbox.ckotech.co'
      },
    })
      .then(function (response) {
        return response
      });
    return GetEntityDetailsfunc;
  } catch (err) {
    if (err?.response?.data) {

      throw err.response.data
    }
    else if (err.code === "ENOMEM") {

      throw "Connection ERROR"
    }
    else {

      throw err
    }
  }
}
async function GetEntityData(bearer, EntityId) {
  try {
    GetEntityDetailsfunc = await axios({
      method: 'get',
      url: baseURL + 'api/entities/' + EntityId,
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
        "host": 'client-admin.cko-sbox.ckotech.co'
      },
    })
      .then(function (response) {
        return response
      });
    return GetEntityDetailsfunc;
  } catch (err) {
    if (err?.response?.data) {

      throw err.response.data
    }
    else if (err.code === "ENOMEM") {

      throw "Connection ERROR"
    }
    else {

      throw err
    }
  }
}
async function Create_Pricing_Profile(bearer, EntityId, EntityName, CKOTEMPLATE) {
  try {
    Create_Pricing_Profile_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityId + '/payment-tiered-pricing-profiles',
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
        "host": 'client-admin.cko-sbox.ckotech.co'
      },
      data: {
        "processing_channels": [],
        "pricing_profile": {
          "is_processing_channel_specific": false,
          "name": EntityName,
          "billing_currency_code": CKOTEMPLATE.currency,
          "fees": {
            "visa": {
              "card_fee_pricing_type": "interchange_plus_plus",
              "card_fee_ic_plus_plus_fees": {
                "return_ic_on_refund": false,
                "premium_variable_fee_percentage": "0.5",
                "premium_fixed_fee": "0.5"
              },
              "card_fee_blended_credit_fees": {
                "consumer_domestic_variable_fee_percentage": "0",
                "consumer_domestic_fixed_fee": "0",
                "consumer_intra_variable_fee_percentage": "0",
                "consumer_intra_fixed_fee": "0",
                "consumer_international_variable_fee_percentage": "0",
                "consumer_international_fixed_fee": "0",
                "commercial_domestic_variable_fee_percentage": "0",
                "commercial_domestic_fixed_fee": "0",
                "commercial_intra_variable_fee_percentage": "0",
                "commercial_intra_fixed_fee": "0",
                "commercial_international_variable_fee_percentage": "0",
                "commercial_international_fixed_fee": "0"
              },
              "card_fee_blended_debit_fees": {
                "consumer_domestic_variable_fee_percentage": "0",
                "consumer_domestic_fixed_fee": "0",
                "consumer_intra_variable_fee_percentage": "0",
                "consumer_intra_fixed_fee": "0",
                "consumer_international_variable_fee_percentage": "0",
                "consumer_international_fixed_fee": "0",
                "commercial_domestic_variable_fee_percentage": "0",
                "commercial_domestic_fixed_fee": "0",
                "commercial_intra_variable_fee_percentage": "0",
                "commercial_intra_fixed_fee": "0",
                "commercial_international_variable_fee_percentage": "0",
                "commercial_international_fixed_fee": "0"
              },
              "payment_gateway_fees": {
                "fee_type": "detailed_fees",
                "gateway_fee": "0",
                "authorization_fee": "0.5",
                "card_verification_fee": "0.5",
                "void_fee": "0.5",
                "refund_fee": "0.5"
              }
            },
            "mastercard": {
              "card_fee_pricing_type": "interchange_plus_plus",
              "card_fee_ic_plus_plus_fees": {
                "return_ic_on_refund": false,
                "premium_variable_fee_percentage": "0.5",
                "premium_fixed_fee": "0.5"
              },
              "card_fee_blended_credit_fees": {
                "consumer_domestic_variable_fee_percentage": "0",
                "consumer_domestic_fixed_fee": "0",
                "consumer_intra_variable_fee_percentage": "0",
                "consumer_intra_fixed_fee": "0",
                "consumer_international_variable_fee_percentage": "0",
                "consumer_international_fixed_fee": "0",
                "commercial_domestic_variable_fee_percentage": "0",
                "commercial_domestic_fixed_fee": "0",
                "commercial_intra_variable_fee_percentage": "0",
                "commercial_intra_fixed_fee": "0",
                "commercial_international_variable_fee_percentage": "0",
                "commercial_international_fixed_fee": "0"
              },
              "card_fee_blended_debit_fees": {
                "consumer_domestic_variable_fee_percentage": "0",
                "consumer_domestic_fixed_fee": "0",
                "consumer_intra_variable_fee_percentage": "0",
                "consumer_intra_fixed_fee": "0",
                "consumer_international_variable_fee_percentage": "0",
                "consumer_international_fixed_fee": "0",
                "commercial_domestic_variable_fee_percentage": "0",
                "commercial_domestic_fixed_fee": "0",
                "commercial_intra_variable_fee_percentage": "0",
                "commercial_intra_fixed_fee": "0",
                "commercial_international_variable_fee_percentage": "0",
                "commercial_international_fixed_fee": "0"
              },
              "payment_gateway_fees": {
                "fee_type": "detailed_fees",
                "gateway_fee": "0",
                "authorization_fee": "0.5",
                "card_verification_fee": "0.5",
                "void_fee": "0.5",
                "refund_fee": "0.5"
              }
            },
            "american_express": {
              "card_fee_pricing_type": "interchange_plus_plus",
              "card_fee_ic_plus_plus_fees": {
                "return_ic_on_refund": false,
                "premium_variable_fee_percentage": "0.5",
                "premium_fixed_fee": "0.5"
              },
              "card_fee_blended_short_fees": {
                "variable_fee_percentage": "0",
                "fixed_fee": "0"
              },
              "payment_gateway_fees": {
                "fee_type": "detailed_fees",
                "gateway_fee": "0",
                "authorization_fee": "0.5",
                "card_verification_fee": "0.5",
                "void_fee": "0.5",
                "refund_fee": "0.5"
              }
            },
            "cartes_bancaires": {
              "card_fee_pricing_type": "interchange_plus_plus",
              "card_fee_ic_plus_plus_fees": {
                "return_ic_on_refund": false,
                "premium_variable_fee_percentage": "0.5",
                "premium_fixed_fee": "0.5"
              },
              "card_fee_blended_credit_fees": {
                "consumer_domestic_variable_fee_percentage": "0",
                "consumer_domestic_fixed_fee": "0",
                "consumer_intra_variable_fee_percentage": "0",
                "consumer_intra_fixed_fee": "0",
                "consumer_international_variable_fee_percentage": "0",
                "consumer_international_fixed_fee": "0",
                "commercial_domestic_variable_fee_percentage": "0",
                "commercial_domestic_fixed_fee": "0",
                "commercial_intra_variable_fee_percentage": "0",
                "commercial_intra_fixed_fee": "0",
                "commercial_international_variable_fee_percentage": "0",
                "commercial_international_fixed_fee": "0"
              },
              "card_fee_blended_debit_fees": {
                "consumer_domestic_variable_fee_percentage": "0",
                "consumer_domestic_fixed_fee": "0",
                "consumer_intra_variable_fee_percentage": "0",
                "consumer_intra_fixed_fee": "0",
                "consumer_international_variable_fee_percentage": "0",
                "consumer_international_fixed_fee": "0",
                "commercial_domestic_variable_fee_percentage": "0",
                "commercial_domestic_fixed_fee": "0",
                "commercial_intra_variable_fee_percentage": "0",
                "commercial_intra_fixed_fee": "0",
                "commercial_international_variable_fee_percentage": "0",
                "commercial_international_fixed_fee": "0"
              },
              "payment_gateway_fees": {
                "fee_type": "detailed_fees",
                "gateway_fee": "0",
                "authorization_fee": "0.5",
                "card_verification_fee": "0.5",
                "void_fee": "0.5",
                "refund_fee": "0.5"
              }
            }
          },
          "disputes_fees": {
            "chargeback_fee": "10",
            "representment_fee": "5",
            "retrieval_fee": "5",
            "rdr_accepted_fee": "7",
            "rdr_declined_fee": "8",
            "apply_interchange_fees": true
          },
          "sessions_fees": {
            "authentication_fixed_fee": "0.7"
          },
          "prism_fees": {
            "risk_assessment_fee": "0.5"
          },
          "exchange_rate_fees": {
            "exchange_rate_fee_percentage": "0"
          },
          "risk_settings_and_arrears": {
            "risk_level": "captured",
            "arrears": 0
          }
        },
        "tiered_pricing": {
          "product": "Payments",
          "assess_on_client_group_volumes": false,
          "tiering_currency": "EUR",
          "fee_details": {},
          "is_enabled": false,
          "entity_id": EntityId
        }
      }
    })
      .then(function (response) {
        return response
      });

    return Create_Pricing_Profile_func;
  }
  catch (err) {
    if (err?.response?.data) {

      throw err.response.data
    }
    else if (err.code === "ENOMEM") {

      throw "Connection ERROR"
    }
    else {

      throw err
    }
  }
}
async function GetPricingProfile(bearer, EntityId) {
  try {
    GetPricingProfilefunc = await axios({
      method: 'get',
      url: baseURL + 'api/entities/' + EntityId + '/payment-pricing-profiles?limit=25&skip=0',
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
        "host": 'client-admin.cko-sbox.ckotech.co'
      },
    })
      .then(function (response) {
        return response
      });
    return GetPricingProfilefunc;
  } catch (err) {
    if (err?.response?.data) {

      throw err.response.data
    }
    else if (err.code === "ENOMEM") {

      throw "Connection ERROR"
    }
    else {

      throw err
    }
  }
}
async function GetVaultID(bearer, ClientID) {
  try {
    GetVaultIDfunc = await axios({
      method: 'get',
      url: baseURL + 'api/clients/' + ClientID + '/vault-account',
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
        "host": 'client-admin.cko-sbox.ckotech.co'
      },
    })
      .then(function (response) {
        return response
      });
    return GetVaultIDfunc;
  } catch (err) {
    if (err?.response?.data) {

      throw err.response.data
    }
    else if (err.code === "ENOMEM") {

      throw "Connection ERROR"
    }
    else {

      throw err
    }
  }
}
async function Create_AMP_Pricing_Profile(bearer, EntityId, EntityName, CKOTEMPLATE) {
  try {
    Create_AMP_Pricing_Profile_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityId + '/apm-pricing-profiles',
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
        "host": 'client-admin.cko-sbox.ckotech.co'
      },
      data: {
        "name": "" + EntityName + "_APM_Payment",
        "payment_methods": [
          {
            "name": "bancontact",
            "label": "Bancontact",
            "logo": "IconPaymentMethodsBancontact",
            "tooltip_description": "Bancontact is a redirection based online banking payment method. CKO offers collecting model only, and processing currency is EUR only. Entity must have a currency account in EUR.",
            "is_collecting_enabled": false,
            "is_collecting_default_value": true,
            "supported_currencies": [
              {
                "label": "EUR",
                "value": "EUR"
              }
            ],
            "merchant_fees": [
              {
                "name": "capture_fixed_fee",
                "label": "Capture fixed fee",
                "amount_type": "fixed",
                "is_collecting": true,
                "fee_category": "capture",
                "is_fx_fee": false,
                "amount": "0.05"
              },
              {
                "name": "fx_markup_fee",
                "label": "FX markup",
                "amount_type": "variable",
                "is_collecting": true,
                "fee_category": "capture",
                "is_fx_fee": true,
                "amount": "0.05"
              },
              {
                "name": "gateway_services",
                "label": "Gateway services fixed fee",
                "amount_type": "fixed",
                "is_collecting": false,
                "fee_category": "gateway",
                "is_fx_fee": false,
                "amount": "0.05"
              },
              {
                "name": "refund_fixed_fee",
                "label": "Refund fixed fee",
                "amount_type": "fixed",
                "is_collecting": true,
                "fee_category": "refund",
                "is_fx_fee": false,
                "amount": "0.05"
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": true
          },
          {
            "name": "sepa",
            "label": "SEPA",
            "logo": "IconPaymentMethodsSepa",
            "tooltip_description": "SEPA is a pan-European network in the eurozone",
            "is_collecting_enabled": false,
            "is_collecting_default_value": true,
            "supported_currencies": [
              {
                "label": "EUR",
                "value": "EUR"
              }
            ],
            "merchant_fees": [
              {
                "name": "capture_fixed_fee",
                "label": "Capture fixed fee",
                "amount_type": "fixed",
                "is_collecting": true,
                "fee_category": "capture",
                "is_fx_fee": false,
                "amount": "0.05"
              },
              {
                "name": "capture_variable_fee",
                "label": "Capture variable fee",
                "amount_type": "variable",
                "is_collecting": true,
                "fee_category": "capture",
                "is_fx_fee": false,
                "amount": "0.05"
              },
              {
                "name": "disputed_return_fixed_fee",
                "label": "Disputed return fixed fee",
                "amount_type": "fixed",
                "is_collecting": true,
                "fee_category": "disputedreturn",
                "is_fx_fee": false,
                "amount": "0.05"
              },
              {
                "name": "gateway_services",
                "label": "Gateway services fixed fee",
                "amount_type": "fixed",
                "is_collecting": false,
                "fee_category": "gateway",
                "is_fx_fee": false,
                "amount": "0.05"
              },
              {
                "name": "refund_fixed_fee",
                "label": "Refund fixed fee",
                "amount_type": "fixed",
                "is_collecting": true,
                "fee_category": "refund",
                "is_fx_fee": false,
                "amount": "0.05"
              },
              {
                "name": "return_fixed_fee",
                "label": "Return fixed fee",
                "amount_type": "fixed",
                "is_collecting": true,
                "fee_category": "return",
                "is_fx_fee": false,
                "amount": "0.05"
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": true
          },
          {
            "name": "test",
            "label": "iDeal",
            "logo": "IconPaymentMethodsIdeal",
            "tooltip_description": "Description of iDeal",
            "is_collecting_enabled": true,
            "is_collecting_default_value": true,
            "supported_currencies": [
              {
                "label": "EUR",
                "value": "EUR"
              },
              {
                "label": "USD",
                "value": "USD"
              }
            ],
            "merchant_fees": [
              {
                "name": "sale_fixed_amount",
                "label": "Sales Fixed Fee",
                "amount_type": "fixed",
                "is_collecting": true,
                "fee_category": "capture",
                "is_fx_fee": true,
                "amount": "0.05"
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": true
          }
        ]
      }
    })
      .then(function (response) {
        return response
      });

    return Create_AMP_Pricing_Profile_func;
  }
  catch (err) {
    if (err?.response?.data) {

      throw err.response.data
    }
    else if (err.code === "ENOMEM") {

      throw "Connection ERROR"
    }
    else {

      throw err
    }
  }
}
async function GetAPMPricingProfile(bearer, EntityId) {
  try {
    GetAPMPricingProfilefunc = await axios({
      method: 'get',
      url: baseURL + 'api/entities/' + EntityId + '/apm-pricing-profiles/first',
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
        "host": 'client-admin.cko-sbox.ckotech.co'
      },
    })
      .then(function (response) {
        return response
      });
    return GetAPMPricingProfilefunc;
  } catch (err) {
    if (err?.response?.data) {

      throw err.response.data
    }
    else if (err?.response?.status) {
      console.log("Status error :",err.response.status)
      return err.response.status
    }
    else if (err.code === "ENOMEM") {

      throw "Connection ERROR"
    }
    else {

      throw err
    }
  }
}
module.exports = {
  GetAllEntity,
  CreateEntity,
  GetEntityData,
  GetEntityDetails,
  Create_Pricing_Profile,
  GetPricingProfile,
  GetVaultID,
  Create_AMP_Pricing_Profile,
  GetAPMPricingProfile
}