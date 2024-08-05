const axios = require('axios');
//const baseURL = "https://client-admin.cko-prod.ckotech.co/";
//const hostURL = baseURL.replace('https://', '').replace('/','');
//templates for creation
const ErrorHandling = require('../Error');

async function GetAllEntity(bearer, ClientId, skip) {
  try {
    GetAllEntityfunc = await axios({
      method: 'get',
      url: baseURL + 'api/clients/' + ClientId + '/entities?limit=25&skip=' + skip,
      headers: {
        'Authorization': bearer,
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'cko-entity-id': ClientId,
        'sec-ch-ua-mobile': '?0',
        'Content-Type': 'application/json',
        'Accept': "*/*",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'sec-ch-ua-platform': "macOS",
        "Sec-Fetch-Site": 'same-origin',
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Dest": "empty",
        "host": hostURL
      }, timeout: 10000
    })
      .then(function (response) {
        return { status: response.status, body: response.data }
      });
    return GetAllEntityfunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetAllEntity");
  }
}
async function CreateEntity(bearer, ClientId, Payload) {
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
        "host": hostURL
      },
      data: Payload,
      timeout: 10000
    })
      .then(function (response) {
        return response
      });

    return CreateEntityfunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "CreateEntity");
  }
}
async function GetEntityDetails(bearer, EntityID) {
  try {
    GetEntityDetailsfunc = await axios({
      method: 'get',
      url: baseURL + 'api/processing-channels/configuration?entityId=' + EntityID,
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
      }, timeout: 10000
    })
      .then(function (response) {
        return response
      });
    return GetEntityDetailsfunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetEntityDetails");
  }
}
async function GetEntityData(bearer, EntityID) {
  try {
    GetEntityDetailsfunc = await axios({
      method: 'get',
      url: baseURL + 'api/entities/' + EntityID,
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
      }, timeout: 10000
    })
      .then(function (response) {
        return response
      });
    return GetEntityDetailsfunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetEntityData");
  }
}
async function Create_Pricing_Profile(bearer, EntityID, Payload) {
  try {
    Create_Pricing_Profile_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/payment-tiered-pricing-profiles',
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
      timeout :2000
    })
      .then(function (response) {
        return response
      });

    return Create_Pricing_Profile_func;
  }
  catch (err) {
    throw ErrorHandling.ErrorHandling(err, "Create_Pricing_Profile");
  }
}
async function GetPricingProfile(bearer, EntityID) {
  try {
    GetPricingProfilefunc = await axios({
      method: 'get',
      url: baseURL + 'api/entities/' + EntityID + '/payment-pricing-profiles?limit=25&skip=0',
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
    })
      .then(function (response) {
        return response
      });
    return GetPricingProfilefunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetPricingProfile");
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
        "host": hostURL
      },
    })
      .then(function (response) {
        return response
      });
    return GetVaultIDfunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetVaultID");
  }
}
async function Create_AMP_Pricing_Profile(bearer, EntityID, EntityName, CKOTEMPLATE) {
  try {
    Create_AMP_Pricing_Profile_func = await axios({
      method: 'post',
      url: baseURL + 'api/entities/' + EntityID + '/apm-pricing-profiles',
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
        "name": "" + EntityName + "_APM_Payment",
        "payment_methods": [
          {
            "name": "alma",
            "label": "Alma",
            "logo": "IconPaymentMethodsAlma",
            "tooltip_description": "Alma is a provider of installment-based payments through a large merchant network. It let customers pay in installments or later online or in-store.",
            "is_collecting_enabled": false,
            "is_collecting_default_value": false,
            "supported_currencies": [
              {
                "label": "EUR",
                "value": "EUR"
              }
            ],
            "merchant_fees": [
              {
                "name": "gateway_services",
                "label": "Gateway services fixed fee",
                "amount_type": "fixed",
                "is_collecting": false,
                "fee_category": "gateway",
                "is_fx_fee": false,
                "amount": "0.05"
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": false
          },
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
            "name": "cvconnect",
            "label": "Cheque Vacances",
            "logo": "IconPaymentMethodsChequeVacancesConnect",
            "tooltip_description": "National voucher scheme for paying at accommodation houses, holiday camps, hotels, youth hostels etc",
            "is_collecting_enabled": false,
            "is_collecting_default_value": false,
            "supported_currencies": [
              {
                "label": "EUR",
                "value": "EUR"
              }
            ],
            "merchant_fees": [
              {
                "name": "gateway_services",
                "label": "Gateway services fixed fee",
                "amount_type": "fixed",
                "is_collecting": false,
                "fee_category": "gateway",
                "is_fx_fee": false,
                "amount": "0.05"
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": false
          },
          {
            "name": "giropay",
            "label": "Giropay",
            "logo": "IconPaymentMethodsGiropay",
            "tooltip_description": "Giropay is an interbank system, and the official implementation of German banks for online banking",
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
                "name": "capture_variable_fee",
                "label": "Capture variable fee",
                "amount_type": "variable",
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
            "currency": "EUR",
            "is_toggled": true,
            "is_collecting": true
          },
          {
            "name": "illicado",
            "label": "Illicado",
            "logo": "IconPaymentMethodsIllicado",
            "tooltip_description": "Multi-brand gift card, that can be used in more than 20,000 points of sale and websites in France",
            "is_collecting_enabled": false,
            "is_collecting_default_value": false,
            "supported_currencies": [
              {
                "label": "EUR",
                "value": "EUR"
              }
            ],
            "merchant_fees": [
              {
                "name": "gateway_services",
                "label": "Gateway services fixed fee",
                "amount_type": "fixed",
                "is_collecting": false,
                "fee_category": "gateway",
                "is_fx_fee": false,
                "amount": "0.05"
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": false
          },
          {
            "name": "mbway",
            "label": "Mbway",
            "logo": "IconPaymentMethodsMbway",
            "tooltip_description": "MB WAY is the leading Payments App in Portugal. The customers can link a debit or credit card to a phone number and shop with instant payments.",
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
                "name": "gateway_services",
                "label": "Gateway services",
                "amount_type": "fixed",
                "is_collecting": false,
                "fee_category": "gateway",
                "is_fx_fee": false,
                "amount": "0.05"
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": true
          },
          {
            "name": "multibanco",
            "label": "Multibanco",
            "logo": "IconPaymentMethodsMultibanco",
            "tooltip_description": "Multibanco is a redirection based online banking payment method. CKO offers collecting model only, and processing currency is EUR.",
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
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": true
          },
          {
            "name": "paypal",
            "label": "PayPal",
            "logo": "IconPaymentMethodsPaypal",
            "tooltip_description": "PayPal is an online payments system supporting different payment options. CKO offers a gateway model only, and the processing currency are AUD, CAD, CHF, CZK, DKK, EUR, GBP, HKD, HUF, JPY, NOK, NZD, PLN, SEK, SGD, USD.",
            "is_collecting_enabled": false,
            "is_collecting_default_value": false,
            "supported_currencies": [
              {
                "label": "AED",
                "value": "AED"
              },
              {
                "label": "AUD",
                "value": "AUD"
              },
              {
                "label": "BHD",
                "value": "BHD"
              },
              {
                "label": "CAD",
                "value": "CAD"
              },
              {
                "label": "CHF",
                "value": "CHF"
              },
              {
                "label": "CZK",
                "value": "CZK"
              },
              {
                "label": "EGP",
                "value": "EGP"
              },
              {
                "label": "EUR",
                "value": "EUR"
              },
              {
                "label": "GBP",
                "value": "GBP"
              },
              {
                "label": "HKD",
                "value": "HKD"
              },
              {
                "label": "JOD",
                "value": "JOD"
              },
              {
                "label": "JPY",
                "value": "JPY"
              },
              {
                "label": "KWD",
                "value": "KWD"
              },
              {
                "label": "NOK",
                "value": "NOK"
              },
              {
                "label": "NZD",
                "value": "NZD"
              },
              {
                "label": "OMR",
                "value": "OMR"
              },
              {
                "label": "PLN",
                "value": "PLN"
              },
              {
                "label": "QAR",
                "value": "QAR"
              },
              {
                "label": "RON",
                "value": "RON"
              },
              {
                "label": "SAR",
                "value": "SAR"
              },
              {
                "label": "SEK",
                "value": "SEK"
              },
              {
                "label": "SGD",
                "value": "SGD"
              },
              {
                "label": "USD",
                "value": "USD"
              }
            ],
            "merchant_fees": [
              {
                "name": "gateway_services",
                "label": "Gateway services fixed fee",
                "amount_type": "fixed",
                "is_collecting": false,
                "fee_category": "gateway",
                "is_fx_fee": false,
                "amount": "0.05"
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": false
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
            "currency": "EUR",
            "is_toggled": true,
            "is_collecting": true
          },
          {
            "name": "sofort",
            "label": "Sofort",
            "logo": "IconPaymentMethodsSofort",
            "tooltip_description": "Sofort is a redirection based online banking payment method. CKO offers collecting model only, and processing currency is EUR only. Entity must have a currency account in EUR.",
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
            "name": "spiritofcadeau",
            "label": "Spirit of Cadeau",
            "logo": "IconPaymentMethodsSpiritOfCadeau",
            "tooltip_description": "A card voucher to spend in more than 20,000 partner shops and websites in France.",
            "is_collecting_enabled": false,
            "is_collecting_default_value": false,
            "supported_currencies": [
              {
                "label": "EUR",
                "value": "EUR"
              }
            ],
            "merchant_fees": [
              {
                "name": "gateway_services",
                "label": "Gateway services fixed fee",
                "amount_type": "fixed",
                "is_collecting": false,
                "fee_category": "gateway",
                "is_fx_fee": false,
                "amount": "0.05"
              }
            ],
            "is_toggled": true,
            "currency": "EUR",
            "is_collecting": false
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
            "currency": "EUR",
            "is_toggled": true,
            "is_collecting": true
          }
        ]
      }
    })
      .then(function (response) {
        //console.log(response)
        return response
      });

    return Create_AMP_Pricing_Profile_func;
  }
  catch (err) {
    console.log(err.response)
    throw ErrorHandling.ErrorHandling(err, "Create_AMP_Pricing_Profile");
  }
}
async function GetAPMPricingProfile(bearer, EntityID) {
  try {
    GetAPMPricingProfilefunc = await axios({
      method: 'get',
      url: baseURL + 'api/entities/' + EntityID + '/apm-pricing-profiles/first',
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
    })
      .then(function (response) {
        return response
      });
    return GetAPMPricingProfilefunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetAPMPricingProfile");
  }
}
async function GetCurrencyAccountList(bearer, EntityID) {
  try {
    GetCurrencyAccountListfunc = await axios({
      method: 'get',
      url: baseURL + 'api/entities/' + EntityID + '/currency-accounts?limit=25&skip=0',
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
    })
      .then(function (response) {
        return response
      });
    return GetCurrencyAccountListfunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetCurrencyAccountListfunc");
  }
}
async function GetPaymentRoutingRule(bearer, EntityID) {
  try {
    GetPaymentRoutingRulefunc = await axios({
      method: 'get',
      url: baseURL + 'api/entities/' + EntityID + '/payment-routing-rules?limit=25&skip=0',
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
    })
      .then(function (response) {
        return response
      });
    return GetPaymentRoutingRulefunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "GetPaymentRoutingRulefunc");
  }
}
async function CreateVaultID(bearer, ClientID) {
  try {
    GetVaultIDfunc = await axios({
      method: 'put',
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
        "host": hostURL
      },
      data: { "is_enabled": true }
    })
      .then(function (response) {
        return response
      });
    return GetVaultIDfunc;
  } catch (err) {
    throw ErrorHandling.ErrorHandling(err, "CreateVaultID");
  }
}
module.exports = {
  GetAllEntity,
  GetPaymentRoutingRule,
  CreateEntity,
  GetEntityData,
  GetEntityDetails,
  Create_Pricing_Profile,
  GetPricingProfile,
  GetVaultID,
  Create_AMP_Pricing_Profile,
  GetAPMPricingProfile,
  GetCurrencyAccountList,
  CreateVaultID
}