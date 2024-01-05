const CATEntity = require('./CAT.EntityConf');
const CATProcessingChannel = require('./CAT.ProcessingChannelConf');
const waitfor = require('../IdempotencyKey');
async function CreateVisaPaymentMethod(Bearer, ProcessingChannelID, ProcessingChannelName) {
    try {
        //Create Manual processor
        CreateProcessingProfile = await CATProcessingChannel.Create_Manual_processor_Visa(Bearer, ProcessingChannelID, ProcessingChannelName)
        PPVisa = CreateProcessingProfile.data.id
        try {
            //Create Session processor Profile
            console.log("Create Session processor Profile Visa")
            CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Visa(Bearer, ProcessingChannelID, ProcessingChannelName, PPVisa);
            return { "Processing_profile": PPVisa, "Session_Processor": CreateSessionProcessor.data.id };
        }
        catch (err) {
            console.log("Error while creating Session processor :",err.data)
            return {"Processing_profile":PPVisa , "Session_Processor":err.data}
        }
    }
    catch (err) {
        console.log("Error while creating Processing Profile :",err.data)
        return err;
    }
}
async function CreateMastercardPaymentMethod(Bearer, ProcessingChannelID, ProcessingChannelName) {
    try {
        CreateProcessingProfile = await CATProcessingChannel.Create_Manual_processor_Mastercard(Bearer, ProcessingChannelID, ProcessingChannelName)
        PPMastercard = CreateProcessingProfile.data.id
        try {
            //Create Session processor Profile
            console.log("Create Session processor Profile Mastercard")
            CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Mastercard(Bearer, ProcessingChannelID, ProcessingChannelName, PPMastercard)
            return { "Processing_profile": PPMastercard, "Session_Processor": CreateSessionProcessor.data.id };
        }
        catch (err) {
            console.log(err)
            return PPMastercard
        }
    }
    catch (err) {
        console.log(err)
        return err
    }

}
async function CreateBancontactPaymentMethod(Bearer, EntityID, ProcessingChannelID,ProcessingChannelName) {
    try {
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Bancontact(Bearer, EntityID, ProcessingChannelName)
        PPBancontact = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile Bancontact")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Bancontact(Bearer, ProcessingChannelID, PPBancontact)
            PrBancontact = CreateProcessor.data.id
            return { "Processing_Profile": PPBancontact, "Processor_Profile": PrBancontact }
        }
        catch (err) {
            console.log(err)
            return { "Processing_Profile": PPBancontact, "Processor_Profile": "Error while creating" }
        }
    }
    catch (err) {
        console.log(err)
        return { "Processing_Profile": "Error while creating", "Processor_Profile": "Error while creating" }
    }
}
async function CreateIdealPaymentMethod(Bearer, EntityID, ProcessingChannelID,ProcessingChannelName) {
    try {
        //Create Processing Profile
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Ideal(Bearer, EntityID, ProcessingChannelName)
        PPIdeal = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile Ideal")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Ideal(Bearer, ProcessingChannelID, PPIdeal)
            PrIdeal = CreateProcessor.data.id
            return { "Processing_Profile": PPIdeal, "Processor_Profile": PrIdeal }
        }
        catch (err) {
            console.log(err)
            return { "Processing_Profile": PrIdeal, "Processor_Profile": "Error while creating" }
        }
    }
    catch (err) {
        console.log(err)
        return { "Processing_Profile": "Error while creating", "Processor_Profile": "Error while creating" }
    }
}
async function CreateCartesBancairesPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName) {
    try {
        //Create Processing Profile
        console.log("Create Processing Profile CB")
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_CB(Bearer, EntityID, ProcessingChannelName)
        PPCb = CreateProcessingProfile.data.id
        console.log("PPCb created :",PPCb)
        try {
            //Create processor Profile
            console.log("Create processor Profile CB")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_CB(Bearer, ProcessingChannelID, PPCb)
            PrCb = CreateProcessor.data.id
            console.log("PrCb created:", PrCb)
            try {
                console.log("Create Session processor Profile CB")
                //Create Session processor Profile
                console.log("wait 1 secondes")
                waitfor.delay(1000);
                CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_CB(Bearer, ProcessingChannelID, PPCb, PrCb);
                return { "Processing_Profile": PPCb, "Processor_Profile": PrCb, "Session_Processor": CreateSessionProcessor.data.id }
            }
            catch (err) {
                console.log(err)
                return { "Processing_Profile": PPCb, "Processor_Profile": PrCb, "Session_Processor": "Error while creating" }
            }
        }
        catch (err) {
            console.log(err)
            return { "Processing_Profile": PPCb, "Processor_Profile": "Error while creating", "Session_Processor": "Error while creating" }
        }
    }
    catch (err) {
        console.log(err)
        return { "Processing_Profile": "Error while creating", "Processor_Profile": "Error while creating", "Session_Processor": "Error while creating" }
    }
}
async function CreateSepaPaymentMethod(Bearer, EntityID, ProcessingChannelID,ProcessingChannelName) {
    try {
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Sepa(Bearer, EntityID, ProcessingChannelName)
        PPSepa = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile SEPA")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Sepa(Bearer, ProcessingChannelID, PPSepa)
            PrSepa = CreateIdealProcessor.data.id
            return { "Processing_Profile": PPSepa, "Processor_Profile": PrSepa }
        }
        catch (err) {
            return { "Processing_Profile": PPSepa, "Processor_Profile": "Error while creating" }
        }
    }
    catch (err) {
        console.log(err)
        return err
    }
}
async function ConfigureProcessingChannel(Bearer, EntityID, ProcessingChannelName,delay) {
    //Configure Currency Account
    try {
        ConfigureProcessingChannelResult = {};
        //Create Currency Account
        console.log("Create Currency Account")
        CreateCurrencyAccount = await CATProcessingChannel.Create_Currency_Account(Bearer, EntityID, ProcessingChannelName)
        CurrencyAccountID = CreateCurrencyAccount.data.id
        ConfigureProcessingChannelResult.Currency_Account_ID= CurrencyAccountID;
        waitfor.delay(delay);
        try {
            //Configure Routing payment rules
            console.log("Create Routing payment rules")
            CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(Bearer, EntityID, ProcessingChannelID, CurrencyAccountID)
            RoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
            ConfigureProcessingChannelResult.Payment_Routing_Rules_ID= RoutingPaymentRulesID;
            waitfor.delay(delay);
        }
        catch (err) {
            return { "Payment_Routing_Rules_ID": err.data }
        }
        try {
            //Configure Routing payout rules
            console.log("Create Routing payout rules")
            CreateRoutingPayoutRules = await CATProcessingChannel.Create_Routing_Rules_Payout(Bearer, EntityID, CurrencyAccountID)
            RoutingPayoutRulesID = CreateRoutingPayoutRules.data.id
            ConfigureProcessingChannelResult.Payout_Routing_Rules_ID= RoutingPayoutRulesID;
            waitfor.delay(delay);
        }
        catch (err) {
            return { "Payout_Routing_Rules_ID": err.data };
        }
        try {
            //Configure Payout Schedule
            console.log("Create Payout Schedule")
            CreatePayoutSchedule = await CATProcessingChannel.Create_Payout_Schedules(Bearer, EntityID, ProcessingChannelName, CurrencyAccountID)
            PayoutScheduleID = CreatePayoutSchedule.data.id
            ConfigureProcessingChannelResult.Payout_Schedule_ID= PayoutScheduleID;
            waitfor.delay(delay);
        }
        catch (err) {
            return { "Payout_Schedule_ID": err.data }
        }
        return ConfigureProcessingChannelResult
    }
    catch (err) {
        console.log(err)
        return { "Currency_Account_ID": err.data };
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
            return {"Processing_Channel_ID":ProcessingChannelID,"Session_Processing_Channel_ID":ProcessingChannelID}
        }
        catch (err) {
            console.log(err)
            return {"Processing_Channel_ID":ProcessingChannelID,"Session_Processing_Channel_ID":"Error while creating"}
        }
    }
    catch (err) {
        console.log(err.response.data);
        return {"Processing_Channel_ID":"Error while creating","Session_Processing_Channel_ID":"Error while creating"}
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