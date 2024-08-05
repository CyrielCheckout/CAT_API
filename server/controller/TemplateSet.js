const CKOSASTEMPLATE = require('../ConfTemplates/CKOSAS.json');
const CKOLTDTEMPLATE = require('../ConfTemplates/CKOLTD.json');
const logger = require('../Utils/logger').logger;
const ErrorHandling = require('./Error');


function configureEntityPayload(CKOLEGALENTITY, EntityName, onboards_sub_entities, sub_entities_profile) {
    if (CKOLEGALENTITY === "cko-sas") {
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    else if (CKOLEGALENTITY === "cko-ltd-uk") {
        CKOTEMPLATE = CKOLTDTEMPLATE;
    }
    else {
        //Default template
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    DefaultPayload = {
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
        "onboards_sub_entities": onboards_sub_entities,
        "referrer": false,
        "processing_urls": [],
        "status": "pending",
        "timezone": "Etc/UTC",
    }
    if (sub_entities_profile) {
        DefaultPayload.sub_entities_profile = sub_entities_profile;
    }
    Result_Payload = DefaultPayload
    return Result_Payload
}

function configureCardProcessingProfile(CKOLEGALENTITY, ProcessingProfileName, Scheme, Payload, MCC) {
    if (CKOLEGALENTITY === "cko-sas") {
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    else if (CKOLEGALENTITY === "cko-ltd-uk") {
        CKOTEMPLATE = CKOLTDTEMPLATE;
    }
    else {
        //Default template
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    if (MCC) {
        business_settings = [];
        for (MCCTOTAL = 0; MCCTOTAL < MCC.length; MCCTOTAL++) {
            business_settings.push(
                {
                    "card_acceptor_identification_code": "",
                    "merchant_category_code": MCC[MCCTOTAL],
                    "force_caid_generation": true
                }
            );
        }
    }
    else {
        business_settings = [{
            "card_acceptor_identification_code": "",
            "merchant_category_code": "0742",
            "force_caid_generation": true
        }]
    }
    var data = {
        "acquirer_key": `cko_${Scheme}_${CKOTEMPLATE.Acquirer_Key}`,
        "processing_type": "payin",
        "processing_profile_name": ProcessingProfileName + `_${Scheme}`,
        "card_acceptor_trade_name": ProcessingProfileName,
        "card_acceptor_legal_name": ProcessingProfileName,
        "card_acceptor_street": CKOTEMPLATE.address_line_1,
        "card_acceptor_city": CKOTEMPLATE.city,
        "card_acceptor_postal_code": CKOTEMPLATE.postal_code,
        "card_acceptor_country_code": CKOTEMPLATE.country_code_iso3,
        //"card_acceptor_region_code": CKOTEMPLATE.region_code,
        "card_acceptor_url": "https://www.checkout.com/",
        "card_acceptor_email": "checkout@checkout.com",
        "card_acceptor_phone": CKOTEMPLATE.phone,
        "status": "Active",
        business_settings
    }
    data = { ...data, ...Payload };
    return data
}

function configureProcessingChannel(ProcessingChannelName, ClientId, EntityID, VaultID, Payload) {
    data = {
        "name": ProcessingChannelName,
        "success_redirect_url": "",
        "fail_redirect_url": "",

        "services": [
            {
                "type": "vault",
                "key": VaultID
            },
            {
                "type": "prism",
                "key": ClientId + "|" + EntityID
            }
        ]
    }
    data = { ...data, ...Payload };
    return data
}

function configureAuthenticationProcessingChannel(ProcessingChannelID, VaultID) {
    data = { "gateway_processing_channel_id": ProcessingChannelID, "services": [{ "label": "Vault", "value": "vault", "key": VaultID }] }
    return data
}

function configureCardGatewayProcessor(CKOLEGALENTITY, GatewayProcessorName, Processor_Profile_ID, Scheme, Payload, PayfacPrefix, MCC,CAID) {
    if (CKOLEGALENTITY === "cko-sas") {
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    else if (CKOLEGALENTITY === "cko-ltd-uk") {
        CKOTEMPLATE = CKOLTDTEMPLATE;
    }
    else {
        //Default template
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    data = {
        "acquirer_key": `cko_${Scheme}_${CKOTEMPLATE.Acquirer_Key}`,
        "profile_id": Processor_Profile_ID,
        "name": GatewayProcessorName + "_" + Scheme,
        "scheme": Scheme,
        "merchant_category_code": MCC,
        "dynamic_descriptor_prefix": "",
        "mode": "complete_processing",
        "acceptor_name": GatewayProcessorName,
        "acceptor_city": CKOTEMPLATE.city,
        "acceptor_country_iso3_code": CKOTEMPLATE.country_code_iso3,
    }
    if (Payload.dynamic_descriptor_prefix === "*") { Payload.dynamic_descriptor_prefix = PayfacPrefix + "*" };
    if (Scheme === "visa") { data.acquirer_id = CKOTEMPLATE.Visa_Acquirer_Key };
    if (Scheme === "amex") { data.acquirer_id = CKOTEMPLATE.Amex_acquirer_key };
    if (Scheme === "mastercard") { data.acquirer_id = CKOTEMPLATE.MC_Acquirer_Key };
    if (Scheme === "cartes_bancaires") { data.acquirer_id = "cko_cb_fr"; delete data['acquirer_key']; }
    if (Scheme === "amex" && Payload.dynamic_descriptor_prefix === "*") { data.acquirer_id = CKOTEMPLATE.Amex_acquirer_key; data.mode = "gateway_services"; delete data['acquirer_key']; }
    if (Scheme === "amex" && Payload.dynamic_descriptor_prefix === "") { data.acquirer_id = CKOTEMPLATE.Amex_acquirer_key; delete data['acquirer_key']; }
    if (Scheme === "bancontact") {delete data['acquirer_key']; }
    if (Scheme === "ideal"){delete data['acquirer_key']; Payload.card_acceptor_identification_code = CAID };
    if (Scheme === "sepa"){delete data['acquirer_key']; Payload.card_acceptor_identification_code = CAID };
    if (Scheme === "sofort"){delete data['acquirer_key']; Payload.card_acceptor_identification_code = CAID };
    if (Scheme === "klarna"){delete data['acquirer_key']; Payload.card_acceptor_identification_code = CAID; delete data['acceptor_country_iso3_code'];delete data['acceptor_city'];Payload.acquirer_id = Payload.acquirer_id+CKOTEMPLATE.Acquirer_Key};
    if (CAID){Payload.card_acceptor_identification_code = CAID}
    data = { ...data, ...Payload };
    return data
}
function configureCardAuthenticationGatewayProcessor(GatewayProcessorId, Processor_Profile_ID, scheme, MCC) {
    data = {
        "createType": "existing",
        "gateway_profile_processor_id": GatewayProcessorId,
        "processing_profile_id": Processor_Profile_ID,
        "scheme": scheme,
        "merchant_category_code": MCC,
        "versions": [
            "2"
        ]
    }
    return data
}

function configurePricingProfile(CKOLEGALENTITY, EntityName, EntityID,BusinessModel) {
    if (CKOLEGALENTITY === "cko-sas") {
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    else if (CKOLEGALENTITY === "cko-ltd-uk") {
        CKOTEMPLATE = CKOLTDTEMPLATE;
    }
    else {
        //Default template
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    data = {
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
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
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
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "mastercard": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
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
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "american_express": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "detailed_fees",
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "discover": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "detailed_fees",
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "dci": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "detailed_fees",
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "cartes_bancaires": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
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
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "mpgs": {
                    "card_fee_pricing_type": "gateway_services_only",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
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
                        "fee_type": "gateway_only",
                        "gateway_variable_fee": "0.05",
                        "gateway_fee": "0.05",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "cybersource": {
                    "card_fee_pricing_type": "gateway_services_only",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_credit_fees": {
                        "consumer_domestic_variable_fee_percentage": "0.05",
                        "consumer_domestic_fixed_fee": "0.05",
                        "consumer_intra_variable_fee_percentage": "0.05",
                        "consumer_intra_fixed_fee": "0.05",
                        "consumer_international_variable_fee_percentage": "0.05",
                        "consumer_international_fixed_fee": "0.05",
                        "commercial_domestic_variable_fee_percentage": "0.05",
                        "commercial_domestic_fixed_fee": "0.05",
                        "commercial_intra_variable_fee_percentage": "0.05",
                        "commercial_intra_fixed_fee": "0.05",
                        "commercial_international_variable_fee_percentage": "0.05",
                        "commercial_international_fixed_fee": "0.05"
                    },
                    "card_fee_blended_debit_fees": {
                        "consumer_domestic_variable_fee_percentage": "0.05",
                        "consumer_domestic_fixed_fee": "0.05",
                        "consumer_intra_variable_fee_percentage": "0.05",
                        "consumer_intra_fixed_fee": "0.05",
                        "consumer_international_variable_fee_percentage": "0.05",
                        "consumer_international_fixed_fee": "0.05",
                        "commercial_domestic_variable_fee_percentage": "0.05",
                        "commercial_domestic_fixed_fee": "0.05",
                        "commercial_intra_variable_fee_percentage": "0.05",
                        "commercial_intra_fixed_fee": "0.05",
                        "commercial_international_variable_fee_percentage": "0.05",
                        "commercial_international_fixed_fee": "0.05"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "gateway_only",
                        "gateway_variable_fee": "0.05",
                        "gateway_fee": "0.05",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "jcb": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "detailed_fees",
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "oman_net": {
                    "card_fee_pricing_type": "gateway_services_only",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "gateway_only",
                        "gateway_variable_fee": "0.05",
                        "gateway_fee": "0.05",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "star": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "detailed_fees",
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "accel": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "detailed_fees",
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "nyce": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "detailed_fees",
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "pulse": {
                    "card_fee_pricing_type": "interchange_plus_plus",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "detailed_fees",
                        "gateway_variable_fee": 0,
                        "gateway_fee": "0",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "mada": {
                    "card_fee_pricing_type": "gateway_services_only",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0.05",
                        "fixed_fee": "0.05"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "gateway_only",
                        "gateway_variable_fee": "0.05",
                        "gateway_fee": "0.05",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                },
                "upi": {
                    "card_fee_pricing_type": "gateway_services_only",
                    "card_fee_ic_plus_plus_fees": {
                        "return_ic_on_refund": false,
                        "premium_variable_fee_percentage": "0.05",
                        "premium_fixed_fee": "0.05"
                    },
                    "card_fee_blended_short_fees": {
                        "variable_fee_percentage": "0",
                        "fixed_fee": "0"
                    },
                    "payment_gateway_fees": {
                        "fee_type": "gateway_only",
                        "gateway_variable_fee": "0.05",
                        "gateway_fee": "0.05",
                        "authorization_fee": "0.05",
                        "card_verification_fee": "0.05",
                        "void_fee": "0.05",
                        "refund_fee": "0.05"
                    }
                }
            },
            "disputes_fees": {
                "chargeback_fee": "5",
                "representment_fee": "6",
                "retrieval_fee": "7",
                "rdr_accepted_fee": "4",
                "rdr_declined_fee": "4",
                "apply_interchange_fees": true
            },
            "sessions_fees": {
                "authentication_fixed_fee": "0.07"
            },
            "prism_fees": {
                "risk_assessment_fee": "0.06"
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
            "entity_id": EntityID
        }
    }
    if (BusinessModel === "PAYFAC_REGULATED") {
        data.pricing_profile.fees.american_express = {
            "card_fee_pricing_type": "gateway_services_only",
            "card_fee_ic_plus_plus_fees": {
                "return_ic_on_refund": false,
                "premium_variable_fee_percentage": 0.05,
                "premium_fixed_fee": 0.05
            },
            "card_fee_blended_short_fees": {
                "variable_fee_percentage": "0",
                "fixed_fee": "0"
            },
            "payment_gateway_fees": {
                "fee_type": "gateway_only",
                "gateway_variable_fee": "0.05",
                "gateway_fee": "0.05",
                "authorization_fee": 0.05,
                "card_verification_fee": 0.05,
                "void_fee": 0.05,
                "refund_fee": 0.05
            }
        }
    };
    return data
}

function configureAPMProcessingProfile(CKOLEGALENTITY, ProcessingProfileName,Scheme, Payload,PaymentMethodSpecificConf) {
    if (CKOLEGALENTITY === "cko-sas") {
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    else if (CKOLEGALENTITY === "cko-ltd-uk") {
        CKOTEMPLATE = CKOLTDTEMPLATE;
    }
    else {
        //Default template
        CKOTEMPLATE = CKOSASTEMPLATE;
    }
    data = {
        "processor_key": "cko-apm",
        "processing_type": "payin",
        "processing_profile_name": ProcessingProfileName + "_"+Scheme,
        "currencies": [
          CKOTEMPLATE.currency
        ],
        "status": "Active",
        "auto_generate_card_acceptor_identification_code": true,
        "business_settings": [
          {
            "card_acceptor_identification_code": "",
            "merchant_category_code": "0742",
            "force_caid_generation": true
          }
        ]
    };
    if(Scheme === "sepa"){Payload.custom_settings.merchant_name = ProcessingProfileName}
    if(Scheme === "sofort"){Payload.custom_settings.billing_descriptor = ProcessingProfileName}
    if(Scheme === "klarna"){Payload.acquirer_key = "klarna_apm_"+CKOTEMPLATE.Acquirer_Key; data.currencies = Payload.currencies;Payload.custom_settings.id = PaymentMethodSpecificConf.klarna_merchant_id;Payload.custom_settings.username = PaymentMethodSpecificConf.klarna_merchant_username;Payload.custom_settings.password = PaymentMethodSpecificConf.klarna_merchant_password;Payload.custom_settings.tier = PaymentMethodSpecificConf.partner_merchant_tier}
    data = { ...data, ...Payload };
    return data
}

module.exports =
{
    configureCardProcessingProfile,
    configureProcessingChannel,
    configureAuthenticationProcessingChannel,
    configureEntityPayload,
    configureCardGatewayProcessor,
    configureCardAuthenticationGatewayProcessor,
    configurePricingProfile,
    configureAPMProcessingProfile
}