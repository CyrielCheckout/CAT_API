const CATEntity = require('./CAT.EntityConf');
const CATProcessingChannel = require('./CAT.ProcessingChannelConf');
const waitfor = require('../IdempotencyKey');
async function CreateVisaPaymentMethod(Bearer, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        //Create Manual processor
        CreateProcessingProfile = await CATProcessingChannel.Create_Manual_processor_Visa(Bearer, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE)
        PPVisa = CreateProcessingProfile.data.id
        try {
            //Create Session processor Profile
            console.log("Create Session processor Profile Visa")
            CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Visa(Bearer, ProcessingChannelID, ProcessingChannelName, PPVisa, CKOTEMPLATE);
            return { "Status": "CONFIGURED","Processing_profile": PPVisa, "Session_Processor": CreateSessionProcessor.data.id };
        }
        catch (err) {
            console.log("Error while creating Session processor :", err)
            return { "Status": "PARTIALLY CONFIGURED","Processing_profile": PPVisa, "Session_Processor": err }
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err };
    }
}
async function CreateMastercardPaymentMethod(Bearer, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    try {
        CreateProcessingProfile = await CATProcessingChannel.Create_Manual_processor_Mastercard(Bearer, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE)
        PPMastercard = CreateProcessingProfile.data.id
        try {
            //Create Session processor Profile
            console.log("Create Session processor Profile Mastercard")
            CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Mastercard(Bearer, ProcessingChannelID, ProcessingChannelName, PPMastercard, CKOTEMPLATE)
            return {"Status": "CONFIGURED", "Processing_profile": PPMastercard, "Session_Processor": CreateSessionProcessor.data.id };
        }
        catch (err) {
            console.log(err)
            return {"Status": "PARTIALLY CONFIGURED", "Processing_profile": PPMastercard, "Session_Processor": err};
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
        return { "Status": "NOT CONFIGURED", "Processing_profile": err }
    }

}
async function CreateBancontactPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName,CKOTEMPLATE) {
    try {
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Bancontact(Bearer, EntityID, ProcessingChannelName,CKOTEMPLATE)
        PPBancontact = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile Bancontact")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Bancontact(Bearer, ProcessingChannelID, PPBancontact,CKOTEMPLATE)
            PrBancontact = CreateProcessor.data.id
            return {"Status": "CONFIGURED", "Processing_Profile": PPBancontact, "Processor_Profile": PrBancontact }
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
async function CreateIdealPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName,CKOTEMPLATE) {
    try {
        //Create Processing Profile
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Ideal(Bearer, EntityID, ProcessingChannelName,CKOTEMPLATE)
        PPIdeal = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile Ideal")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Ideal(Bearer, ProcessingChannelID, PPIdeal,CKOTEMPLATE)
            PrIdeal = CreateProcessor.data.id
            return {"Status": "CONFIGURED", "Processing_Profile": PPIdeal, "Processor_Profile": PrIdeal }
        }
        catch (err) {
            console.log("ERROR while creating Processing Processor :",err)
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PrIdeal, "Processor_Profile": err }
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
            console.log("Create Processing Profile CB")
            CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_CB(Bearer, EntityID, ProcessingChannelName, CKOTEMPLATE)
            PPCb = CreateProcessingProfile.data.id
            console.log("PPCb created :", PPCb)
            try {
                //Create processor Profile
                console.log("Create processor Profile CB")
                CreateProcessor = await CATProcessingChannel.Create_processing_processor_CB(Bearer, ProcessingChannelID, PPCb, CKOTEMPLATE)
                PrCb = CreateProcessor.data.id
                console.log("PrCb created:", PrCb)
                try {
                    console.log("Create Session processor Profile CB")
                    //Create Session processor Profile
                    console.log("wait 1 secondes")
                    waitfor.delay(1000);
                    CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_CB(Bearer, ProcessingChannelID, PPCb, PrCb);
                    return { "Status": "CONFIGURED", "Processing_Profile": PPCb, "Processor_Profile": PrCb, "Session_Processor": CreateSessionProcessor.data.id }
                }
                catch (err) {
                    console.log(err)
                    return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PPCb, "Processor_Profile": PrCb, "Session_Processor": err }
                }
            }
            catch (err) {
                console.log(err)
                return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": PPCb, "Processor_Profile": err, "Session_Processor": err }
            }
        }
        else {
            throw "CB can only be configured on CKO-SAS legal entity"
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :", err)
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
            //Configure Routing payment rules
            console.log("Create Routing payment rules")
            CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(Bearer, EntityID, ProcessingChannelID, CurrencyAccountID)
            RoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
            ConfigureProcessingChannelResult.Payment_Routing_Rules_ID = RoutingPaymentRulesID;
            waitfor.delay(delay);
        }
        catch (err) {
            return { "Payment_Routing_Rules_ID": err }
        }
        try {
            //Configure Routing payout rules
            console.log("Create Routing payout rules")
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
            console.log("Create Payout Schedule")
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
        console.log(err)
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
            console.log("Vault ID", VaultID);
        }
        catch (err) { console.log(err); return err }
        ProcessingChannelResult = await CATProcessingChannel.CreateProcessingChannel(Bearer, ClientID, EntityID, ProcessingChannelName, VaultID)
        ProcessingChannelID = ProcessingChannelResult.data.id;
        console.log("Processing channel ID Created :", ProcessingChannelID)

        try {
            CreateSessionProcessingChannelResult = await CATProcessingChannel.Create_Session_Processing_Channels(Bearer, EntityID, ProcessingChannelID, VaultID);
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
    CreateProcessingChannel,
    CreateVisaPaymentMethod,
    CreateMastercardPaymentMethod,
    CreateBancontactPaymentMethod,
    CreateIdealPaymentMethod,
    CreateCartesBancairesPaymentMethod,
    CreateSepaPaymentMethod,
    ConfigureProcessingChannel
}