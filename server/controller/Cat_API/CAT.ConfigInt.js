const CATEntity = require('./CAT.EntityConf');
const CATProcessingChannel = require('./CAT.ProcessingChannelConf');
const waitfor = require('../IdempotencyKey');
const loggerInfo = require('../../Utils/logger').loggerInfo;
const loggerError = require('../../Utils/logger').loggerError;
async function CreateVisaPaymentMethodOld(Bearer, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        try {
            //Create Manual processor
            loggerInfo.log('info', `Create Visa Processor for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
            CreateProcessingProfile = await CATProcessingChannel.Create_Manual_processor_Visa(Bearer, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE)
            PPVisa = CreateProcessingProfile.data.id
            try {
                //Create Session processor Profile
                loggerInfo.log(`info`, `Create Session Visa Processor for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
                CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Visa(Bearer, ProcessingChannelID, ProcessingChannelName, PPVisa, CKOTEMPLATE);
                return { "Status": "CONFIGURED", "Processing_profile": PPVisa, "Session_Processor": CreateSessionProcessor.data.id };
            }
            catch (err) {
                logger.console.error(`Error while creating Session processor : ${err}`, `CAT_API`);
                //console.log("Error while creating Session processor :", err)
                return { "Status": "PARTIALLY CONFIGURED", "Processing_profile": PPVisa, "Session_Processor": err }
            }
        }
        catch (err) {
            console.log("Error while creating Processing Profile :", err)
            return { "Status": "NOT CONFIGURED", "Processing_profile": err };
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err };
    }
}
async function CreateVisaPaymentMethod(Bearer, EntityId, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        //Create Processing Profile 
        loggerInfo.log('info', `Create Visa Processing Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Visa(Bearer, EntityId, ProcessingChannelName, CKOTEMPLATE)
        PPVisa = CreateProcessingProfile.data.id
        try {
            //Create Gateway Processor Profile
            loggerInfo.log(`info`, `Create Visa Gateway Processor for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
            CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor_Visa(Bearer, ProcessingChannelID, ProcessingChannelName, PPVisa, CKOTEMPLATE);
            GPPVisa = CreateGatewayProcessor.data.id;
            try {
                //Create Session Processor Profile
                loggerInfo.log(`info`, `Create Visa Gateway Processor for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
                CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor_Visa(Bearer, ProcessingChannelID, ProcessingChannelName, PPVisa, GPPVisa, CKOTEMPLATE);
                return { "Status": "CONFIGURED", "Processing_profile": PPVisa, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
            }
            catch (err) {
                loggerInfo.error(`Error while creating Session processor : ${err}`, `CAT_API`);
                //console.log("Error while creating Session processor :", err)
                return { "Status": "PARTIALLY CONFIGURED", "Processing_profile": PPVisa, "Gateway_Processor": err }
            }
        }
        catch (err) {
            loggerInfo.error(`Error while creating Gateway processor : ${err}`, `CAT_API`);
            //console.log("Error while creating Session processor :", err)
            return { "Status": "PARTIALLY CONFIGURED", "Processing_profile": PPVisa, "Gateway_Processor": err }
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err };
    }
}
async function CreateMastercardPaymentMethodOld(Bearer, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        loggerInfo.log(`info`, `Create Mastercard Processor for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
        CreateProcessingProfile = await CATProcessingChannel.Create_Manual_processor_Mastercard(Bearer, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE)
        PPMastercard = CreateProcessingProfile.data.id
        try {
            //Create Session processor Profile
            loggerInfo.log(`info`, `Create Session Mastercard Processor for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
            CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Mastercard(Bearer, ProcessingChannelID, ProcessingChannelName, PPMastercard, CKOTEMPLATE)
            return { "Status": "CONFIGURED", "Processing_profile": PPMastercard, "Session_Processor": CreateSessionProcessor.data.id };
        }
        catch (err) {
            console.log(err)
            return { "Status": "PARTIALLY CONFIGURED", "Processing_profile": PPMastercard, "Session_Processor": err };
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err }
    }

}
async function CreateMastercardPaymentMethod(Bearer, EntityId, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        //Create Processing Profile 
        loggerInfo.log('info', `Create Mastercard Processing Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_MC(Bearer, EntityId, ProcessingChannelName, CKOTEMPLATE)
        PPMastercard = CreateProcessingProfile.data.id
        try {
            //Create Gateway Processor Profile
            loggerInfo.log(`info`, `Create Mastercard Gateway Processor for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
            CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor_MC(Bearer, ProcessingChannelID, ProcessingChannelName, PPMastercard, CKOTEMPLATE);
            GPPMastercard = CreateGatewayProcessor.data.id;
            Console.log(CreateGatewayProcessor.data)
            try {
                //Create Session Processor Profile
                loggerInfo.log(`info`, `Create Mastercard Session Processor for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
                CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor_MC(Bearer, ProcessingChannelID, ProcessingChannelName, PPMastercard, GPPMastercard, CKOTEMPLATE);
                return { "Status": "CONFIGURED", "Processing_profile": PPMastercard, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
            }
            catch (err) {
                loggerInfo.error(`Error while creating Session processor : ${err}`, `CAT_API`);
                //console.log("Error while creating Session processor :", err)
                return { "Status": "PARTIALLY CONFIGURED", "Processing_profile": PPMastercard, "Gateway_Processor": err }
            }
        }
        catch (err) {
            loggerInfo.error(`Error while creating Gateway processor : ${err}`, `CAT_API`);
            //console.log("Error while creating Session processor :", err)
            return { "Status": "PARTIALLY CONFIGURED", "Processing_profile": PPMastercard, "Gateway_Processor": err }
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err };
    }
}
async function CreateBancontactPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        loggerInfo.log(`info`, `Create Bancontact Processing Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Bancontact(Bearer, EntityID, ProcessingChannelName, CKOTEMPLATE)
        PPBancontact = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            loggerInfo.log(`info`, `Create Bancontact Processor Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Bancontact(Bearer, ProcessingChannelID, PPBancontact, CKOTEMPLATE)
            PrBancontact = CreateProcessor.data.id
            return { "Status": "CONFIGURED", "Processing_Profile": PPBancontact, "Processor_Profile": PrBancontact }
        }
        catch (err) {
            console.log(err)
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PPBancontact, "Processor_Profile": err }
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err }
    }
}
async function CreateIdealPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        //Create Processing Profile
        loggerInfo.log(`info`, `Create Ideal Processing Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Ideal(Bearer, EntityID, ProcessingChannelName, CKOTEMPLATE)
        PPIdeal = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            loggerInfo.log(`info`, `Create Ideal Processor Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Ideal(Bearer, ProcessingChannelID, PPIdeal, CKOTEMPLATE)
            PrIdeal = CreateProcessor.data.id
            return { "Status": "CONFIGURED", "Processing_Profile": PPIdeal, "Processor_Profile": PrIdeal }
        }
        catch (err) {
            console.log("ERROR while creating Processing Processor :", err)
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PrIdeal, "Processor_Profile": err }
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err }
    }
}
async function CreateGiroPayPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        //Create Processing Profile
        loggerInfo.log(`info`, `Create Giropay Processing Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Giropay(Bearer, EntityID, ProcessingChannelName, CKOTEMPLATE)
        PPGIropay = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            loggerInfo.log(`info`, `Create Giropay Processor Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Giropay(Bearer, ProcessingChannelID, PPGIropay, CKOTEMPLATE)
            PrGiropay = CreateProcessor.data.id
            return { "Status": "CONFIGURED", "Processing_Profile": PPGIropay, "Processor_Profile": PrGiropay }
        }
        catch (err) {
            console.log("ERROR while creating Processing Processor :", err)
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PPGIropay, "Processor_Profile": err }
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err }
    }
}
async function CreateCartesBancairesPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        if (CKOTEMPLATE.CKOLegalEntity === "cko-sas") {
            //Create Processing Profile
            loggerInfo.log(`info`, `Create Cartes Bancaires Processing Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
            CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_CB(Bearer, EntityID, ProcessingChannelName, CKOTEMPLATE)
            PPCb = CreateProcessingProfile.data.id
            loggerInfo.log(`info`, `Cartes Bancaires Processing Profile created ${PPCb}`, `CAT_API`);
            try {
                //Create processor Profile
                loggerInfo.log(`info`, `Create Cartes Bancaires Processor Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
                CreateProcessor = await CATProcessingChannel.Create_processing_processor_CB(Bearer, ProcessingChannelID, PPCb, CKOTEMPLATE)
                PrCb = CreateProcessor.data.id
                loggerInfo.log(`info`, `Cartes Bancaires Processor Profile created ${PrCb}`, `CAT_API`);
                try {
                    //Create Session processor Profile
                    waitfor.delay(1000);
                    loggerInfo.log(`info`, `Create Cartes Bancaires Session Processor Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
                    CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_CB(Bearer, ProcessingChannelID, PPCb, PrCb);
                    return { "Status": "CONFIGURED", "Processing_Profile": PPCb, "Processor_Profile": PrCb, "Session_Processor": CreateSessionProcessor.data.id }
                }
                catch (err) {
                    loggerError.error(`info`, `Cartes Bancaires Session Processor Profile not configured (${ProcessingChannelName}, ${ProcessingChannelID}, error : ${JSON.stringify(err)})`, `CAT_API_BATCH`);
                    return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PPCb, "Processor_Profile": PrCb, "Session_Processor": err }
                }
            }
            catch (err) {
                loggerError.error(`info`, `Cartes Bancaires Processor Profile not configured (${ProcessingChannelName}, ${ProcessingChannelID}, error : ${JSON.stringify(err)})`, `CAT_API`);
                return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PPCb, "Processor_Profile": err, "Session_Processor": err }
            }
        }
        else {
            throw "CB can only be configured on CKO-SAS legal entity"
        }
    }
    catch (err) {
        loggerError.error(`info`, `Cartes Bancaires Processing Profile not configured (${ProcessingChannelName}, ${ProcessingChannelID}, error : ${JSON.stringify(err)})`, `CAT_API`);
        return { "Status": "NOT CONFIGURED", "Processing_profile": err }
    }
}
async function CreateAmexPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        //Create Processing Profile
        loggerInfo.log(`info`, `Create Amex Processing Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Amex(Bearer, EntityID, ProcessingChannelName, CKOTEMPLATE)
        PPAmex = CreateProcessingProfile.data.id
        loggerInfo.log(`info`, `Amex Processing Profile created ${PPAmex}`, `CAT_API`);
        try {
            //Create processor Profile
            loggerInfo.log(`info`, `Create Amex Processor Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Amex(Bearer, ProcessingChannelID, ProcessingChannelName, PPAmex, CKOTEMPLATE)
            PrAmex = CreateProcessor.data.id
            loggerInfo.log(`info`, `Amex Processor Profile created ${PrAmex}`, `CAT_API`);
            try {
                //Create Session processor Profile
                waitfor.delay(1000);
                loggerInfo.log(`info`, `Create Amex Session Processor Profile for ${ProcessingChannelName} (${ProcessingChannelID} with ${CKOTEMPLATE})`, `CAT_API`);
                CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Amex(Bearer, ProcessingChannelID, PPAmex, PrAmex);
                return { "Status": "CONFIGURED", "Processing_Profile": PPAmex, "Processor_Profile": PrAmex, "Session_Processor": CreateSessionProcessor.data.id }
            }
            catch (err) {
                loggerError.error(`info`, `Amex Session Processor Profile not configured (${ProcessingChannelName}, ${ProcessingChannelID}, error : ${JSON.stringify(err)})`, `CAT_API_BATCH`);
                return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PPAmex, "Processor_Profile": PrAmex, "Session_Processor": err }
            }
        }
        catch (err) {
            loggerError.error(`info`, `Amex Processor Profile not configured (${ProcessingChannelName}, ${ProcessingChannelID}, error : ${JSON.stringify(err)})`, `CAT_API`);
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PPAmex, "Processor_Profile": err, "Session_Processor": err }
        }
    }
    catch (err) {
        loggerError.error(`info`, `Amex Processing Profile not configured (${ProcessingChannelName}, ${ProcessingChannelID}, error : ${JSON.stringify(err)})`, `CAT_API`);
        return { "Status": "NOT CONFIGURED", "Processing_profile": err }
    }
}
async function CreateSepaPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName) {
    try {
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Sepa(Bearer, EntityID, ProcessingChannelName)
        PPSepa = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile SEPA")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Sepa(Bearer, ProcessingChannelID, PPSepa)
            PrSepa = CreateProcessor.data.id
            return { "Status": "CONFIGURED", "Processing_Profile": PPSepa, "Processor_Profile": PrSepa }
        }
        catch (err) {
            console.log(err)
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PPSepa, "Processor_Profile": err }
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err }
    }
}
async function ConfigureProcessingChannel(Bearer, EntityID, ProcessingChannelName, delay, CKOTEMPLATE) {
    //Configure Currency Account
    try {
        ConfigureProcessingChannelResult = {};
        //Create Currency Account
        console.log("Create Currency Account")
        CreateCurrencyAccount = await CATProcessingChannel.Create_Currency_Account(Bearer, EntityID, ProcessingChannelName, CKOTEMPLATE)
        CurrencyAccountID = CreateCurrencyAccount.data.id
        ConfigureProcessingChannelResult.Currency_Account_ID = CurrencyAccountID;
        waitfor.delay(delay);
        try {
            //Configure Defaut Routing payment rules

            loggerInfo.log(`info`, `Create DEFAUT routing payment rules for ${EntityID} and CurrencyAccount : ${CurrencyAccountID}`, `CAT_API`);
            CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(Bearer, EntityID, null, CurrencyAccountID, true)
            RoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
            ConfigureProcessingChannelResult.Payment_Routing_Rules_ID = RoutingPaymentRulesID;
            waitfor.delay(delay);
        }
        catch (err) {
            return { "Payment_Routing_Rules_ID": err }
        }
        try {
            //Configure Routing payment rules
            loggerInfo.log(`info`, `Create routing payment rules for ${EntityID} CurrencyAccount : ${CurrencyAccountID}`, `CAT_API`);
            CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(Bearer, EntityID, ProcessingChannelID, CurrencyAccountID, false)
            RoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
            ConfigureProcessingChannelResult.Payment_Routing_Rules_ID = RoutingPaymentRulesID;
            waitfor.delay(delay);
        }
        catch (err) {
            return { "Payment_Routing_Rules_ID": err }
        }
        try {
            //Configure Routing payout rules
            loggerInfo.log(`info`, `Create routing payout rules for ${EntityID} and CurrencyAccount : ${CurrencyAccountID}`, `CAT_API`);
            CreateRoutingPayoutRules = await CATProcessingChannel.Create_Routing_Rules_Payout(Bearer, EntityID, CurrencyAccountID)
            RoutingPayoutRulesID = CreateRoutingPayoutRules.data.id
            ConfigureProcessingChannelResult.Payout_Routing_Rules_ID = RoutingPayoutRulesID;
            waitfor.delay(delay);
        }
        catch (err) {
            return { "Payout_Routing_Rules_ID": err };
        }
        try {
            //Configure Payout Schedule
            loggerInfo.log(`info`, `Create Payout Schedule for ${EntityID} and CurrencyAccount : ${CurrencyAccountID}`, `CAT_API`);
            CreatePayoutSchedule = await CATProcessingChannel.Create_Payout_Schedules(Bearer, EntityID, ProcessingChannelName, CurrencyAccountID, CKOTEMPLATE)
            PayoutScheduleID = CreatePayoutSchedule.data.id
            ConfigureProcessingChannelResult.Payout_Schedule_ID = PayoutScheduleID;
            waitfor.delay(delay);
        }
        catch (err) {
            return { "Payout_Schedule_ID": err }
        }
        return ConfigureProcessingChannelResult
    }
    catch (err) {
        return { "Currency_Account_ID": err };
    }
}
async function CreateProcessingChannel(Bearer, ClientID, EntityID, ProcessingChannelName) {
    try {
        try {
            //GetVaultID
            console.log("Get Vault ID");
            GetVaultId = await CATEntity.GetVaultID(Bearer, ClientID);
            VaultID = GetVaultId.data.id;
            console.log("Vault ID =", VaultID);
        }
        catch (err) {
            console.log(err);
            return err
        }
        ProcessingChannelResult = await CATProcessingChannel.CreateProcessingChannel(Bearer, ClientID, EntityID, ProcessingChannelName, VaultID)
        ProcessingChannelID = ProcessingChannelResult.data.id;
        console.log("Processing channel ID Created :", ProcessingChannelID)
        try {
            CreateSessionProcessingChannelResult = await CATProcessingChannel.Create_Session_Processing_Channels(Bearer, EntityID, ProcessingChannelID, VaultID);
            console.log("Session Processing Channel created :",ProcessingChannelID)
            return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": ProcessingChannelID }
        }
        catch (err) {
            console.log(err)
            return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": err }
        }
    }
    catch (err) {
        console.log(err);
        return { "Processing_Channel_ID": err, "Session_Processing_Channel_ID": err }
    }

}
module.exports = {
    CreateMastercardPaymentMethodOld,
    CreateVisaPaymentMethodOld,
    CreateProcessingChannel,
    CreateVisaPaymentMethod,
    CreateAmexPaymentMethod,
    CreateMastercardPaymentMethod,
    CreateBancontactPaymentMethod,
    CreateIdealPaymentMethod,
    CreateCartesBancairesPaymentMethod,
    CreateSepaPaymentMethod,
    ConfigureProcessingChannel,
    CreateGiroPayPaymentMethod
}