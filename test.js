const { faker } = require(`@faker-js/faker`);
//const CAT_MerchantCONF = require("./server/controller/Cat_API/[Batch]Merchant_Main_Method");
//const CAT_GetMerchantConf = require("./server/controller/Cat_API/[Batch]GetMerchantConf");
//const CAT_Entity_CAT_API = require("./server/controller/Cat_API/[CAT]Entity_API");
const axios = require('axios');
const jwtJsDecode = require('jwt-js-decode');
const ValidBearer = "eyJraWQiOiJaYXdvNVZMeTlIR1phS0RlLUY4anU0dlF6WWNnYWpCR0ZSZlduWWxkdUhjIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULjhaMXZDdjkyVGpLM1hEUWxLcklLVDBBSF91MldBQkpvRE5veVVkNGRpVWciLCJpc3MiOiJodHRwczovL2NoZWNrb3V0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzc2t1ajN4YUNCN0ZUMmcwaDciLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzIxMTIzNzY1LCJleHAiOjE3MjExMjczNjUsImNpZCI6IjBvYXNrdHowMG5vTjVjQTV4MGg3IiwidWlkIjoiMDB1MTY1b2pvNmdOV20xVWwwaDgiLCJzY3AiOlsib3BlbmlkIiwicHJvZmlsZSIsImNsaWVudGFkbWluLXRvb2wiXSwiYXV0aF90aW1lIjoxNzIxMTE2NjE4LCJzdWIiOiJjeXJpZWxnaGVuZHJpaC1mZWlsbGFudEBjaGVja291dC5jb20iLCJmdWxsX25hbWUiOiJDeXJpZWwgR2hlbmRyaWgtRmVpbGxhbnQiLCJjYXQtZ3JvdXBzIjpbIkFwcC5BdGxhcy5DQVQuU2FuZGJveC5TdXBwb3J0Il19.aJnh5Qff7S-GJUDstwyX-qDpSfjsVDXes3Bhdvzoq4_TC35HGr9lK98BoSM5g_4gcIkIYY2b9bVncAe09uBIhXagknmt2L5mqvEivQXS33UNbXxcZRGmmV2lHG-hKl8n2V4JGUV96xCH2z9p6uVHwq304NyP8tpGPCq8am8aUnjnQ7ZA_u4gT6WBWvelz8YIvBOClJH0QrkEUbXVLuc9wVPVmt91NqHCHcNOqSlmdTD5S6OvmsMP_HkLkoVfd3pKFQgC82ew7BIIXUtbgj4jYpnzKmwr4tReQ9p6KkMKo1mK0LByE4zRoO2BIeRC3c6h-c65WwVmbI1tTjYNuF6e0g";
DecodedJWT = jwtJsDecode.decode(ValidBearer);
console.log("Configuration")
describe('---------------GET_tests---------------', () => {
test(`Expired Bearer send back 401 when trying to fetch the available VaultID`, async () => {
    expect.assertions(1);
    await axios({
        method: 'post',
        url: 'http://127.0.0.1:4000/CatAPI/ConfigureMerchant/',
        data: {
            "Bearer": "Bearer eyJraWQiOiJVVGI3bUk5aFgzYjBEOUVEMmxldjlZS2t1U1ZfTFAwSXNsZmVJZ2hZb2RNIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULmFkb05rYWtLSEoybmtPekRtWVphZUNDeUMyY0pfOVBXNHJ6SHpwa3FTY1EiLCJpc3MiOiJodHRwczovL2NoZWNrb3V0Lm9rdGFwcmV2aWV3LmNvbS9vYXV0aDIvYXVzc2t1ajN4YUNCN0ZUMmcwaDciLCJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaWF0IjoxNzE1NjgxNjUyLCJleHAiOjE3MTU2ODUyNTIsImNpZCI6IjBvYXNrdHowMG5vTjVjQTV4MGg3IiwidWlkIjoiMDB1MWNmbHRvcHZ0c21xUDEwaDgiLCJzY3AiOlsicHJvZmlsZSIsIm9wZW5pZCIsImNsaWVudGFkbWluLXRvb2wiXSwiYXV0aF90aW1lIjoxNzE1Njc0NDc4LCJzdWIiOiJmcmFuY29pcy5mYWxjb25ldEBjaGVja291dC5jb20iLCJmdWxsX25hbWUiOiJGcmFuw6dvaXMgRmFsY29uZXQiLCJjYXQtZ3JvdXBzIjpbIkFwcC5BdGxhcy5DQVQuU2FuZGJveC5TdXBwb3J0Il19.SJaCe5AkdOgwuQ-Tjd-oKpsxbOmesyX9XoVCLR3rS1zd_N0FJ4HZCxdy0eL06sGxxoa-DWWc7wxIdkQekA2UgK1wEg27a8oMWNIX1YX43Wt1H8WhIrbPy3KpQHhSvgPqSMU3Cb3Tc179jKlhlhpjR0M8snlRqBoviCa52tBu-uo-2TA4KHJaG5AyO9K8iYTByaKt9DYcMRj1aWX-uZPGqW_k7AvDuQ7b4UdBfe9PJIaOToEIexJ7uoy0oXvDuzh1j_P5cOpHKUZEoUp2c5R3rQ4crNvBHxuUZqURCaclDzFVDKc8JLfpC8Nfv13vJEDIC22wkdM9JBnlZECGdC-QsQ",
            "ClientId": "cli_ydtgdn6ipkvebgyktj5nn5u2ze",
            "delay": 1,
            "Entity": [
                {
                    "EntityID": "ent_drsf5p2qmtngozoohupxdcykcq",
                    "Processing_channel": [
                        {
                            "ProcessingChannelName": "test",
                            "PaymentMethod": [
                                "CARTES_BANCAIRES",
                                "VISA",
                                "MASTERCARD",
                                "IDEAL",
                                "SEPA"
                            ]
                        }
                    ]
                }
            ]
        }
    })
        .then(function (response) {
            expect(response.data.status).toBe(401);
            return response
        })
        .catch(error => {
            expect(error.response.status).toBe(401);
        });
});

test(`Invalid client ID return error 400`, async () => {
    expect.assertions(1);
    await axios({
        method: 'post',
        url: 'http://127.0.0.1:4000/CatAPI/ConfigureMerchant/',
        data: {
            "Bearer": "Bearer " + ValidBearer,
            "ClientId": "cli_ydtgdn6ipkj5nn5u2ze",
            "delay": 1,
            "Entity": [
                {
                    "EntityID": "ent_drsf5p2qmtngozoohupxdcykcq",
                    "Processing_channel": [
                        {
                            "ProcessingChannelName": "test",
                            "PaymentMethod": [
                                "CARTES_BANCAIRES",
                                "VISA",
                                "MASTERCARD",
                                "IDEAL",
                                "SEPA"
                            ]
                        }
                    ]
                }
            ]
        }
    })
        .then(function (response) {
            expect(response.data.status).toBe(400);
        })
        .catch(error => {
            expect(error.response.status).toBe(400);
        });
});
test(`Entity does not exist under ClientID send back 404`, async () => {
    expect.assertions(1);
    await axios({
        method: 'post',
        url: 'http://127.0.0.1:4000/CatAPI/ConfigureMerchant/',
        data: {
            "Bearer": "Bearer " + ValidBearer,
            "ClientId": "cli_ydtgdn6ipkvebgyktj5nn5u2ze",
            "delay": 1,
            "Entity": [
                {
                    "EntityID": "ent_drsf5p2qmtngozoohupxdcykq",
                    "Processing_channel": [
                        {
                            "ProcessingChannelName": "test",
                            "PaymentMethod": [
                                "CARTES_BANCAIRES",
                                "VISA",
                                "MASTERCARD",
                                "IDEAL",
                                "SEPA"
                            ]
                        }
                    ]
                }
            ]
        }
    })
        .then(function (response) {
            expect(response.data.Entity[0].status.status).toBe(404);
        })
        .catch(error => {
            expect(error.response.status).toBe(404);
        });
}, 20000);
test(`GetMerchantDetails send back http 200 and 7 entity`, async () => {
    expect.assertions(2);
    await axios({
        method: 'post',
        url: 'http://127.0.0.1:4000/CatAPI/GetMerchantConf/',
        data: {
            "Bearer": "Bearer " + ValidBearer,
            "ClientId": "cli_yfdvunlgk5bu5lzsopfz5hmvjm",
            "delay": 1
        }
    })
        .then(response => {
            CAT_GetMerchantConf_result = response.data
        })

    expect(CAT_GetMerchantConf_result.status).toBe(200)
    expect(CAT_GetMerchantConf_result.Entity.length).toBe(7);
}, 20000);
test(`GetMerchantDetails entity MOR send back http 200 and 2 processing channels and have one with id pc_nhobb7sghexednann6wkztfkym`, async () => {
    expect.assertions(3);
    expect(CAT_GetMerchantConf_result.status).toBe(200);
    expect(CAT_GetMerchantConf_result.Entity[3].Processing_channel.length).toBe(3);
    expect(CAT_GetMerchantConf_result.Entity[3].Processing_channel[0].ProcessingChannelID).toBe("pc_nhobb7sghexednann6wkztfkym");
}, 20000);
});

describe('---------------S_A1---------------', () => {
    test(`S_A1 Try to create 2 entity and one processing channel per entity with all available payment methods`, async () => {
        expect.assertions(3);
        await axios({
            method: 'post',
            url: 'http://127.0.0.1:4000/CatAPI/ConfigureMerchant/',
            data: {
                "Bearer": "Bearer " + ValidBearer,
                "ClientId": "cli_pemlobzqt6aengtlbutjxvfmjq",
                "delay": 1,
                "Entity": [
                    {
                        "EntityName": faker.airline.airplane().name,
                        "LegalEntity": "cko-sas",
                        "Processing_channel": [
                            {
                                "ProcessingChannelName": faker.airline.airplane().iataTypeCode,
                                "PaymentMethod": [
                                    "VISA",
                                    "MASTERCARD",
                                    "CARTES_BANCAIRES",
                                    "IDEAL",
                                    "BANCONTACT",
                                    "AMEX",
                                    "SEPA",
                                    "SOFORT",
                                    "KLARNA"
                                ],
                                "PaymentMethodSpecificConf": {
                                    "KLARNA": {
                                        "klarna_merchant_id": "sqdqsd",
                                        "partner_merchant_tier": "tier2", //tier1, tier2, tier3
                                        "klarna_merchant_username": "sdqdq",
                                        "klarna_merchant_password": "qsdqsdqsdq"
                                    }
                                }
                            }
                        ],
                    },
                    {
                        "EntityName": faker.airline.airplane().name,
                        "LegalEntity": "cko-ltd-uk",
                        "Processing_channel": [
                            {
                                "ProcessingChannelName": faker.airline.airplane().iataTypeCode,
                                "PaymentMethod": [
                                    "CARTES_BANCAIRES",
                                    "VISA",
                                    "MASTERCARD",
                                    "IDEAL",
                                    "BANCONTACT",
                                    "AMEX",
                                    "SEPA",
                                    "SOFORT",
                                    "KLARNA"
                                ]
                            }
                        ]
                    }
                ]
            }
        })
            .then(function (response) {
                //console.log(response.data.Entity[0].Processing_Channel[0])
                CreateEntityAndProcessingChannel = response.data
            })
            .catch(function (err) {
                console.log(err);
              });
        expect(CreateEntityAndProcessingChannel.status).toBe(202);
        expect(CreateEntityAndProcessingChannel.Entity.length).toBe(2);
        expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel.length).toBe(1);
    }, 200000);
    //check for SAS
    describe('---------------S_A1 : CKO-SAS ---------------', () => {
        test(`S_A1 - Createconf - SAS - Test should have successfully created a currencry account`, async () => {
            expect.assertions(2);
            console.log(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0])
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].CurrencyAccount.CURRENCY_ACCOUNT).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].CurrencyAccount.Currency_Account_ID).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully created a PaymentRoutingRules`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].PaymentRoutingRules.PAYMENT_ROUTING_RULES).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].PaymentRoutingRules.Payment_Routing_Rules_ID).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully created a RoutingPayoutRules`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].RoutingPayoutRules.PAYOUT_ROUTING_RULES).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].RoutingPayoutRules.Payout_Routing_Rules_ID).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully created a PayoutSchedule`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].PayoutSchedule.PAYOUT_SCHEDULE).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].PayoutSchedule.Payout_Schedule_ID).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Visa`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.VISA.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.VISA.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.VISA.Gateway_Processor).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.VISA.Session_Processor).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Mastercard`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.MASTERCARD.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.MASTERCARD.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.MASTERCARD.Gateway_Processor).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.MASTERCARD.Session_Processor).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Cartes Bancaires`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Gateway_Processor).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Session_Processor).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Amex`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.AMEX.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.AMEX.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.AMEX.Gateway_Processor).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.AMEX.Session_Processor).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Bancontact`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.BANCONTACT.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.BANCONTACT.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.BANCONTACT.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Ideal`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.IDEAL.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.IDEAL.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.IDEAL.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Sepa`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.SEPA.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.SEPA.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.SEPA.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Giropay`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.GIROPAY.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.GIROPAY.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.GIROPAY.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Sofort`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.SOFORT.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.SOFORT.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.SOFORT.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_A1 - Createconf - SAS - Test should have successfully configured Klarna`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.KLARNA.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.KLARNA.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[0].Processing_Channel[0].Payment_Method.KLARNA.Gateway_Processor).toBeDefined();
        }, 20000);
    })
    //checks for LTD 
    describe('---------------S_A2 : CKO-LTD ---------------', () => {
        test(`S_A2 - Createconf - LTD - Test should have successfully created a currencry account`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].CurrencyAccount.CURRENCY_ACCOUNT).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].CurrencyAccount.Currency_Account_ID).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully created a PaymentRoutingRules`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].PaymentRoutingRules.PAYMENT_ROUTING_RULES).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].PaymentRoutingRules.Payment_Routing_Rules_ID).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully created a RoutingPayoutRules`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].RoutingPayoutRules.PAYOUT_ROUTING_RULES).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].RoutingPayoutRules.Payout_Routing_Rules_ID).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully created a PayoutSchedule`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].PayoutSchedule.PAYOUT_SCHEDULE).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].PayoutSchedule.Payout_Schedule_ID).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully configured Visa`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.VISA.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.VISA.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.VISA.Gateway_Processor).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.VISA.Session_Processor).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully configured Mastercard`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.MASTERCARD.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.MASTERCARD.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.MASTERCARD.Gateway_Processor).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.MASTERCARD.Session_Processor).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully configured Cartes Bancaires`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Status).toBe("NOT CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Processing_Profile).toBe("CB can only be configured on CKO-SAS legal entity")
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully configured Amex`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.AMEX.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.AMEX.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.AMEX.Gateway_Processor).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.AMEX.Session_Processor).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully configured Bancontact`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.BANCONTACT.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.BANCONTACT.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.BANCONTACT.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully configured Ideal`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.IDEAL.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.IDEAL.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.IDEAL.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully configured Sepa`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.SEPA.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.SEPA.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.SEPA.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully configured Giropay`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.GIROPAY.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.GIROPAY.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.GIROPAY.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_A2 - Createconf - LTD - Test should have successfully configured SOFORT`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.SOFORT.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.SOFORT.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannel.Entity[1].Processing_Channel[0].Payment_Method.SOFORT.Gateway_Processor).toBeDefined();
        }, 20000);
    });
});
/*
describe('---------------S_B : Force creation to fail ---------------', () => {
    describe('---------------S_B1 : Create entity with too long name will fail ---------------', () => {
        test(`S_B1 - Create entity one with too long name`, async () => {
            expect.assertions(3);
            await axios({
                method: 'post',
                url: 'http://127.0.0.1:4000/CatAPI/ConfigureMerchant/',
                data: {
                    "Bearer": "Bearer " + ValidBearer,
                    "ClientId": "cli_pemlobzqt6aengtlbutjxvfmjq",
                    "delay": 1,
                    "Entity": [
                        {
                            "EntityName": faker.lorem.sentence({ min: 40, max: 41 }),
                            "LegalEntity": "cko-sas",
                            "Processing_channel": [
                                {
                                    "ProcessingChannelName": faker.airline.airplane().iataTypeCode,
                                    "PaymentMethod": [
                                        "CARTES_BANCAIRES",
                                        "VISA",
                                        "MASTERCARD",
                                        "IDEAL",
                                        "BANCONTACT",
                                        "GIROPAY",
                                        "AMEX",
                                        "SEPA",
                                        "SOFORT"
                                    ]
                                }
                            ]
                        },
                        {
                            "EntityName": faker.airline.airplane().name,
                            "LegalEntity": "cko-sas",
                            "Processing_channel": [
                                {
                                    "ProcessingChannelName": faker.lorem.sentence({ min: 40, max: 41 }),
                                    "PaymentMethod": [
                                        "CARTES_BANCAIRES",
                                        "VISA",
                                        "MASTERCARD",
                                        "IDEAL",
                                        "BANCONTACT",
                                        "GIROPAY",
                                        "AMEX",
                                        "SEPA",
                                        "SOFORT"
                                    ]
                                },
                                {
                                    "ProcessingChannelName": null,
                                    "PaymentMethod": [
                                        "CARTES_BANCAIRES",
                                        "VISA",
                                        "MASTERCARD",
                                        "IDEAL",
                                        "BANCONTACT",
                                        "GIROPAY",
                                        "AMEX",
                                        "SEPA",
                                        "SOFORT"
                                    ]
                                }
                            ]
                        },
                        {
                            "EntityName": faker.airline.airplane().name,
                            "LegalEntity": "cko-sas",
                            "Processing_channel": [
                                {
                                    "ProcessingChannelName": faker.airline.airplane().iataTypeCode,
                                    "PaymentMethod": [
                                        "CARTES_BANCAIRES",
                                        "VISA",
                                        "MASTERCARD",
                                        "IDEAL",
                                        "BANCONTACT",
                                        "GIROPAY",
                                        "AMEX",
                                        "SEPA",
                                        "SOFORT"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            })
                .then(function (response) {
                    CreateEntityAndProcessingChannelfailed = response.data
                });
            expect(CreateEntityAndProcessingChannelfailed.Entity[0].EntityID).toBe("ERROR");
            expect(CreateEntityAndProcessingChannelfailed.Entity[0].status.status).toBe(422);
            expect(CreateEntityAndProcessingChannelfailed.Entity.length).toBe(3);
        }, 200000);
    });
    describe('---------------S_B2 Create processing channel with very long name (will partially failed)---------------', () => {
        //check failed processing channel creation
        test(`S_B2 - Createconf - SAS - Test should have failed to created a currencry account`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].CurrencyAccount.CURRENCY_ACCOUNT).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].CurrencyAccount.Currency_Account_ID).toBeDefined();
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have successfully created a PaymentRoutingRules`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].PaymentRoutingRules.PAYMENT_ROUTING_RULES).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].PaymentRoutingRules.Payment_Routing_Rules_ID).toBeDefined();
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have successfully created a RoutingPayoutRules`, async () => {
            expect.assertions(2);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].RoutingPayoutRules.PAYOUT_ROUTING_RULES).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].RoutingPayoutRules.Payout_Routing_Rules_ID).toBeDefined();
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have failed created a PayoutSchedule`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].PayoutSchedule.Error.status).toBe(422);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].PayoutSchedule.Error.Error_Message.error_codes).toStrictEqual(["client_settlement_name_exceeds_256_characters"]);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].PayoutSchedule.Error.source).toBe('Create_Payout_Schedules');
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have failed to configure Visa`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.VISA.Status).toBe('NOT CONFIGURED');
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.VISA.Processing_Profile.status).toBe(422);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.VISA.Processing_Profile.source).toBe('Create_Processing_profile_Visa');
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.VISA.Processing_Profile.Error_Message.error_codes).toStrictEqual(['card_acceptor_legal_name_invalid']);
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have failed to configure Mastercard`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.MASTERCARD.Status).toBe('NOT CONFIGURED');
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.MASTERCARD.Processing_Profile.status).toBe(422);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.MASTERCARD.Processing_Profile.source).toBe('Create_Processing_profile_MC');
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.MASTERCARD.Processing_Profile.Error_Message.error_codes).toStrictEqual(['card_acceptor_legal_name_invalid']);
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have failed to configure Cartes Bancaires`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Status).toBe('NOT CONFIGURED');
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Processing_Profile.status).toBe(422);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Processing_Profile.source).toBe('Create_Processing_profile_CB');
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.CARTES_BANCAIRES.Processing_Profile.Error_Message.error_codes).toStrictEqual(['processing_profile_name_invalid']);
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have failed to configure Amex`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.AMEX.Status).toBe('NOT CONFIGURED');
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.AMEX.Gateway_Processor.status).toBe(422);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.AMEX.Gateway_Processor.source).toBe('Create_Processing_profile_Amex');
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.AMEX.Gateway_Processor.Error_Message.error_codes).toStrictEqual(['card_acceptor_trade_name_invalid']);
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have successfully configured Bancontact`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.BANCONTACT.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.BANCONTACT.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.BANCONTACT.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have successfully configured Ideal`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.IDEAL.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.IDEAL.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.IDEAL.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have successfully configured Sepa`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.SEPA.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.SEPA.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.SEPA.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have successfully configured Giropay`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.GIROPAY.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.GIROPAY.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.GIROPAY.Gateway_Processor).toBeDefined();
        }, 20000);
        test(`S_B2 - Createconf - SAS - Test should have failed to configure Sofort`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.SOFORT.Status).toBe("CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.SOFORT.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[0].Payment_Method.SOFORT.Gateway_Processor).toBeDefined();
        }, 20000);
    })
    describe('---------------S_B3 Create processing channel without a name(will partially failed for APM)---------------', () => {
        test(`S_B3 - Createconf - SAS - Test should have failed to create the processing channel`, async () => {
            expect.assertions(1);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Processing_Channel_ID).toBe(undefined);
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should have failed to create a currencry account`, async () => {
            expect.assertions(1);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].CurrencyAccount.CURRENCY_ACCOUNT).toBe("NOT CONFIGURED");
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should not have attempted to create a PaymentRoutingRules`, async () => {
            expect.assertions(1);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].PaymentRoutingRules).toBeUndefined()
                ;
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should not have attempted to create a RoutingPayoutRules`, async () => {
            expect.assertions(1);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].RoutingPayoutRules).toBeUndefined();
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should not have attempted to create a PayoutSchedule`, async () => {
            expect.assertions(1);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].PayoutSchedule).toBeUndefined();
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should have failed to configure Visa`, async () => {
            expect.assertions(1);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.VISA.Status).toBe("NOT CONFIGURED");
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should have failed to configure Mastercard`, async () => {
            expect.assertions(1);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.MASTERCARD.Status).toBe("NOT CONFIGURED");
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should have failed to configure Cartes Bancaires`, async () => {
            expect.assertions(1);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.CARTES_BANCAIRES.Status).toBe("NOT CONFIGURED");
        }, 20000);
        test(`S_B3 - Createconf - SAS - test should have failed to fully configure Amex`, async () => {
            expect.assertions(4);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.AMEX.Status).toBe("PARTIALLY CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.AMEX.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.AMEX.Gateway_Processor.status).toBe(503);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.AMEX.Session_Processor.status).toBe(503);
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should have failed to fully configure Bancontact`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.BANCONTACT.Status).toBe("PARTIALLY CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.BANCONTACT.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.BANCONTACT.Gateway_Processor.status).toBe(503);
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should have failed to fully configure Ideal`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.IDEAL.Status).toBe("PARTIALLY CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.IDEAL.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.IDEAL.Gateway_Processor.status).toBe(503);
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should have failed to fully configure Sepa`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.SEPA.Status).toBe("PARTIALLY CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.SEPA.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.SEPA.Gateway_Processor.status).toBe(503);
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should have failed to fully configure Giropay`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.GIROPAY.Status).toBe("PARTIALLY CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.GIROPAY.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.GIROPAY.Gateway_Processor.status).toBe(503);
        }, 20000);
        test(`S_B3 - Createconf - SAS - Test should have failed to fully configure Sofort`, async () => {
            expect.assertions(3);
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.SOFORT.Status).toBe("PARTIALLY CONFIGURED");
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.SOFORT.Processing_Profile).toBeDefined();
            expect(CreateEntityAndProcessingChannelfailed.Entity[1].Processing_Channel[1].Payment_Method.SOFORT.Gateway_Processor.status).toBe(503);
        }, 20000);
    });
});*/