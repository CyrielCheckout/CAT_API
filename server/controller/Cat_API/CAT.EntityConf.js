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
      url: baseURL + 'api/clients/' + ClientId + '/entities?limit=25&skip='+ skip,
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
  } catch (err) { console.log(err); throw err }
}

async function CreateEntity(bearer, ClientId, EntityName) {
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
          "line1": "11 rue du test",
          "line2": "rue du test",
          "city": "Paris",
          "postcode": "75000",
          "country_iso3_code": "FRA",
          "state": "Paris"
        },
        "is_principal_same_as_registered": true,
        "is_regulated": false,
        "issuer": {
          "type": ""
        },
        "company_number": "99999999999999",
        "tax_number": "",
        "cko_legal_entity": "cko-sas",
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
  } catch (err) { throw err }
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
    throw err
  }
}

async function Create_Pricing_Profile(TemplateName,bearer, EntityId, EntityName) {
 /* TemplateName = path.resolve(TemplateName);
  template = await fs.readFile(TemplateName,'utf8', function (err, content) {if (err){ throw err}else{return content;}});
  console.log(template)*/
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
          "billing_currency_code": "EUR",
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
    throw err
  }
}

module.exports = {
  GetAllEntity,
  CreateEntity,
  GetEntityDetails,
  Create_Pricing_Profile
}