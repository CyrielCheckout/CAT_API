const CATEntity = require('./CAT.EntityConf');
const CATProcessingChannel = require('./CAT.ProcessingChannelConf');
const waitfor = require('../IdempotencyKey');
const CatConfigInt = require('../Cat_API/CAT.ConfigInt');
const CatPaymentMethodConfig = require('../Cat_API/CAT.PaymentMethodCONF')

async function Createconf2(body) {
    console.log("Number of entity requested :", body.Entity.length)
    finalresult = { "Entity": [] };
    console.log(body);
    for (let i = 0; i < body.Entity.length; i++) {
        //Entity check and creation
        try {
            if (body.Entity[i].hasOwnProperty('EntityID')) {
                console.log("Entity already created:", body.Entity[i].EntityID);
                EntityResult = await CATEntity.GetEntityData(body.Bearer, body.Entity[i].EntityID);
                finalresult.Entity.push({ "Entity_Name": EntityResult.data.name, "EntityID": EntityResult.data.id, "status": EntityResult.data.status });
                //Check if one Pricing Profile exist
                PricingProfileResult = await CATEntity.GetPricingProfile(body.Bearer, body.Entity[i].EntityID);
                if (PricingProfileResult.data.total_count > 1) {
                    //If Pricing Profile exist and there is more than one, then list them
                    finalresult.Entity[i].push({ "Pricing_Profile_ID": [] });
                    for (let ProcessingProfileNumber = 0; ProcessingProfileNumber < PricingProfileResult.data._embedded.pricing_profiles.length; ProcessingProfileNumber++) {
                        finalresult.Entity[i].Pricing_Profile_ID.push(PricingProfileResult.data._embedded.pricing_profiles[ProcessingProfileNumber].id);
                    }
                }
                else if (PricingProfileResult.data.total_count === 1) {
                    //If Pricing Profile exist and there is one, then list it
                    finalresult.Entity[i].Pricing_Profile_ID = PricingProfileResult.data._embedded.pricing_profiles[0].id;
                }
                else {
                    //If Pricing Profile dosen't exist, then create it
                    try {
                        console.log("Create Pricing Profile")
                        GetPricingProfile = await CATEntity.Create_Pricing_Profile(body.Entity[i].EntityLegalEntity, body.Bearer, EntityID, body.Entity[i].EntityName);
                        finalresult.Entity[i].Pricing_Profile_ID = GetPricingProfile.data.id;
                    }
                    catch (err) {
                        finalresult.Entity[i].Pricing_Profile_ID = err.data;
                    }
                };
                //Processing Channel configuration 
                finalresult.Entity[i].Processing_Channel = []
                for (let ProcessingChannelNumber = 0; ProcessingChannelNumber < body.Entity[i].Processing_channel.length; ProcessingChannelNumber++) {
                    if (body.Entity[i].Processing_channel[ProcessingChannelNumber].hasOwnProperty('ProcessingChannelID')) {
                        //If processing channel exist, then get data
                        console.log("Processing Channel already created :", body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID);
                        try {
                            GetVaultId = await CATEntity.GetVaultID(body.Bearer, body.ClientId);
                            VaultID = GetVaultId.data.id;
                            finalresult.Entity[i].VaultID = VaultID;
                        }
                        catch (err) {
                            console.log(err);
                            finalresult.Entity[i].VaultID = "Error while get VaultID";
                        }
                        try {
                            GetProcessingChannelData = await CATProcessingChannel.GetProcessingChannelConf(body.Bearer, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID);
                            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID, "Processing_Channel_Name": GetProcessingChannelData.data.name };
                            //Check if Session Processing Channel Exist
                            SessionProcessingChannel = await CATProcessingChannel.Get_Processing_channel_Session(body.Bearer, body.Entity[i].EntityID);
                            for (let SProcessingChannelNumber = 0; SProcessingChannelNumber < SessionProcessingChannel.data.available_gateway_processing_channels.length; SProcessingChannelNumber++) {
                                if (SessionProcessingChannel.data.available_gateway_processing_channels[SProcessingChannelNumber].id === body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID) {
                                    //Create it 
                                    try{
                                        console.log("Create Session Processing Channel")
                                    SESSIONPRocessingChannelCreat = await CATProcessingChannel.Create_Session_Processing_Channels(body.Bearer, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID, VaultID);
                                }
                                catch (err){
                                    console.log(err)
                                    return err
                                }
                                }
                            }
                        }
                        catch (err) {
                            console.log(err);
                            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": "Error while get ID" };
                        }
                        //Configure Payment Method
                        PaymentMethodConfResult = await CatPaymentMethodConfig.ConfPaymentMethod(body.Entity[i].Processing_channel[ProcessingChannelNumber].PaymentMethod, body.Bearer, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID, GetProcessingChannelData.data.name);
                        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].Payment_Method = PaymentMethodConfResult;
                    }
                    else {
                        //If not, then Create Processing channel
                        console.log("Creating processing channel :", body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName);
                        //create processing channel
                        PROCESSINGCHANNELCONF = await CatConfigInt.CreateProcessingChannel(body.Bearer, body.ClientId, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName);
                        finalresult.Entity[i].VaultID = VaultID;
                        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": ProcessingChannelID, "Processing_Channel_Name": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName };
                        // configure processing channel
                        ConfigureProcessingChannelFunc = await CatConfigInt.ConfigureProcessingChannel(body.Bearer, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName, body.delay);
                        if (ConfigureProcessingChannelFunc.hasOwnProperty("Currency_Account_ID")) {
                            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].CurrencyAccountSetup = { "CURRENCY_ACCOUNT": "CONFIGURED", "Currency_Account_ID": ConfigureProcessingChannelFunc.Currency_Account_ID };
                        };
                        if (ConfigureProcessingChannelFunc.hasOwnProperty("Payment_Routing_Rules_ID")) {
                            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].PaymentRoutingRulesSetup = { "PAYMENT_ROUTING_RULES": "CONFIGURED", "Payment_Routing_Rules_ID": ConfigureProcessingChannelFunc.Currency_Account_ID };
                        };
                        if (ConfigureProcessingChannelFunc.hasOwnProperty("Payout_Routing_Rules_ID")) {
                            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].CreateRoutingPayoutRules = { "PAYOUT_ROUTING_RULES": "CONFIGURED", "Payout_Routing_Rules_ID": ConfigureProcessingChannelFunc.Payout_Routing_Rules_ID };
                        };
                        if (ConfigureProcessingChannelFunc.hasOwnProperty("Payout_Routing_Rules_ID")) {
                            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].PayoutScheduleSetup = { "PAYOUT_SCHEDULE": "CONFIGURED", "Payout_Schedule_ID": ConfigureProcessingChannelFunc.Payout_Schedule_ID };
                        };
                        //Configure Payment Method
                        PaymentMethodConfResult = await CatPaymentMethodConfig.ConfPaymentMethod(body.Entity[i].Processing_channel[ProcessingChannelNumber].PaymentMethod, body.Bearer, body.Entity[i].EntityID, ProcessingChannelID, GetProcessingChannelData.data.name);
                        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].Payment_Method = PaymentMethodConfResult;
                    }
                }
            }
            else {
                //Create Entity
                console.log("Creating entity :", body.Entity[i].EntityName);
                EntityResult = await CATEntity.CreateEntity(body.Bearer, body.ClientId, body.Entity[i].EntityName);
                waitfor.delay(body.delay);
                console.log("Entity creation status:", EntityResult.status);
                EntityID = EntityResult.data.id;
                finalresult.Entity.push({ "Entity_Name": body.Entity[i].EntityName, "EntityID": EntityID, "status": EntityResult.status });
                console.log("Entity :", body.Entity[i].EntityName, "was successfully created with the ID :", EntityID);
                //Create Pricing Profile
                try {
                    console.log("Create Pricing Profile")
                    GetPricingProfile = await CATEntity.Create_Pricing_Profile(body.Entity[i].EntityLegalEntity, body.Bearer, EntityID, body.Entity[i].EntityName);
                    finalresult.Entity[i].Pricing_Profile_ID = GetPricingProfile.data.id;
                }
                catch (err) {
                    finalresult.Entity[i].Pricing_Profile_ID = err.data;
                }
                finalresult.Entity[i].Processing_Channel = []
                for (let ProcessingChannelNumber = 0; ProcessingChannelNumber < body.Entity[i].Processing_channel.length; ProcessingChannelNumber++) {
                    console.log("Creating processing channel :", body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName);
                    //Create processing channel
                    PROCESSINGCHANNELCONF = await CatConfigInt.CreateProcessingChannel(body.Bearer, body.ClientId, EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName);
                    finalresult.Entity[i].VaultID = VaultID;
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": PROCESSINGCHANNELCONF.Processing_Channel_ID, "Processing_Channel_Name": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName };
                    // configure processing channel
                    ConfigureProcessingChannelFunc = await CatConfigInt.ConfigureProcessingChannel(body.Bearer, EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName, body.delay);
                    if (ConfigureProcessingChannelFunc.hasOwnProperty("Currency_Account_ID")) {
                        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].CurrencyAccountSetup = { "CURRENCY_ACCOUNT": "CONFIGURED", "Currency_Account_ID": ConfigureProcessingChannelFunc.Currency_Account_ID };
                    };
                    if (ConfigureProcessingChannelFunc.hasOwnProperty("Payment_Routing_Rules_ID")) {
                        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].PaymentRoutingRulesSetup = { "PAYMENT_ROUTING_RULES": "CONFIGURED", "Payment_Routing_Rules_ID": ConfigureProcessingChannelFunc.Currency_Account_ID };
                    };
                    if (ConfigureProcessingChannelFunc.hasOwnProperty("Payout_Routing_Rules_ID")) {
                        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].CreateRoutingPayoutRules = { "PAYOUT_ROUTING_RULES": "CONFIGURED", "Payout_Routing_Rules_ID": ConfigureProcessingChannelFunc.Payout_Routing_Rules_ID };
                    };
                    if (ConfigureProcessingChannelFunc.hasOwnProperty("Payout_Routing_Rules_ID")) {
                        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].PayoutScheduleSetup = { "PAYOUT_SCHEDULE": "CONFIGURED", "Payout_Schedule_ID": ConfigureProcessingChannelFunc.Payout_Schedule_ID };
                    };
                    //Configure Payment Method
                    PaymentMethodConfResult = await CatPaymentMethodConfig.ConfPaymentMethod(body.Entity[i].Processing_channel[ProcessingChannelNumber].PaymentMethod, body.Bearer, EntityID, PROCESSINGCHANNELCONF.Processing_Channel_ID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName);
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].Payment_Method = PaymentMethodConfResult;
                }
            }
        }
        catch (err) {
            if (err?.response?.status) {
                if (err.response.status === 401) {
                    return { "status": 401, "Message": "please renew the Bearer Token" }
                }
                if (err.response.status === 422) {
                    finalresult = { "EntityID": "Error 422", "status": 422, "Message": err.response.data }
                    return finalresult
                }
            }
            else {
                console.log(err)
                finalresult = { "EntityID": "Connection Error", "status": 500, "Message": "Check you VPN connection" }
                return finalresult
            }
        }
    }
    finalresult['status'] = 201
    return finalresult
}

module.exports = {
    Createconf2
}