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
            CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Visa(body.Bearer, ProcessingChannelID, body.Entity[Ent].Processing_channel[e].ProcessingChannelName, PPVisa);
            return PPVisa, CreateSessionProcessor.data.id;
        }
        catch (err) {
            console.log(err)
            return PPVisa
        }
    }
    catch (err) {
        console.log(err)
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
            return PPMastercard, CreateSessionProcessor.data.id;
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
async function CreateBancontactPaymentMethod(Bearer, EntityID, ProcessingChannelName, ProcessingChannelID) {
    try {
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Bancontact(Bearer, EntityID, ProcessingChannelName)
        PPBancontact = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile Bancontact")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Bancontact(Bearer, ProcessingChannelID, PPBancontact)
            PrBancontact = CreateProcessor.data.id
            return PPBancontact, PrBancontact
        }
        catch (err) {
            console.log(err)
            return PPBancontact
        }
    }
    catch (err) {
        console.log(err)
        return err
    }
}
async function CreateIdealPaymentMethod(Bearer, EntityID, ProcessingChannelName, ProcessingChannelID) {
    try {
        //Create Processing Profile
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Ideal(Bearer, EntityID, ProcessingChannelName)
        PPIdeal = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile Ideal")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Ideal(Bearer, ProcessingChannelID, PPIdeal)
            PrIdeal = CreateProcessor.data.id
            return PPIdeal, PrIdeal
        }
        catch (err) {
            console.log(err)
            return PrIdeal
        }
    }
    catch (err) {
        console.log(err)
        return err
    }
}
async function CreateCartesBancairesPaymentMethod(Bearer, EntityID, ProcessingChannelName, ProcessingChannelID) {
    try {
        //Create Processing Profile
        console.log("Create Processing Profile CB")
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_CB(Bearer, EntityID, ProcessingChannelName)
        PPCb = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile CB")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_CB(Bearer, ProcessingChannelID, PPCb)
            PrCb = CreateProcessor.data.id
            console.log("PrCb created:", PrCb)
            try {
                console.log("Create Session processor Profile CB")
                //Create Session processor Profile
                console.log("wait 10 secondes")
                waitfor.delay(10000);
                CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_CB(Bearer, ProcessingChannelID, PPCb, PrCb)
                return PPCb, PrCb, CreateSessionProcessor.data.id
            }
            catch (err) {
                return PPCb, PrCb
            }
        }
        catch (err) {
            return PPCb
        }
    }
    catch (err) {
        console.log(err)
        return err
    }
}
async function CreateSepaPaymentMethod(Bearer, EntityID, ProcessingChannelName, ProcessingChannelID) {
    try {
        CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Sepa(Bearer, EntityID, ProcessingChannelName)
        PPSepa = CreateProcessingProfile.data.id
        try {
            //Create processor Profile
            console.log("Create processor Profile SEPA")
            CreateProcessor = await CATProcessingChannel.Create_processing_processor_Sepa(Bearer, ProcessingChannelID, PPSepa)
            PrSepa = CreateIdealProcessor.data.id
            return PPSepa, PrSepa;
        }
        catch (err) {
            return PPSepa
        }
    }
    catch (err) {
        console.log(err)
        return err
    }
}
async function ConfigureProcessingChannel(Bearer, EntityID, ProcessingChannelName) {
    //Configure Currency Account
    try {
        //Create Currency Account
        console.log("Create Currency Account")
        CreateCurrencyAccount = await CATProcessingChannel.Create_Currency_Account(Bearer, EntityID, ProcessingChannelName)
        CurrencyAccountID = CreateCurrencyAccount.data.id
        finalresult.Entity[Ent].Processing_Channel[e].CurrencyAccountSetup = { "CURRENCY_ACCOUNT": "CONFIGURED", "Currency_Account_ID": CreateCurrencyAccount.data.id };
        waitfor.delay(body.delay);
        try {
            //Configure Routing payment rules
            console.log("Create Routing payment rules")
            CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(Bearer, EntityID, ProcessingChannelID, CurrencyAccountID)
            RoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
            finalresult.Entity[Ent].Processing_Channel[e].PaymentRoutingRulesSetup = { "PAYMENT_ROUTING_RULES": "CONFIGURED", "Payment_Routing_Rules_ID": CreateRoutingPaymentRules.data.id };
            waitfor.delay(body.delay);
        }
        catch (err) {
            finalresult.Entity[Ent].Processing_Channel[e].PaymentRoutingRulesSetup = { "PAYMENT_ROUTING_RULES": "NOT CONFIGURED", "Payment_Routing_Rules_ID": err.data };
        }
        try {
            //Configure Routing payout rules
            console.log("Create Routing payout rules")
            CreateRoutingPayoutRules = await CATProcessingChannel.Create_Routing_Rules_Payout(Bearer, EntityID, CurrencyAccountID)
            RoutingPayoutRulesID = CreateRoutingPayoutRules.data.id
            finalresult.Entity[Ent].Processing_Channel[e].CreateRoutingPayoutRules = { "PAYOUT_ROUTING_RULES": "CONFIGURED", "Payout_Routing_Rules_ID": CreateRoutingPayoutRules.data.id };
            waitfor.delay(body.delay);
        }
        catch (err) {
            finalresult.Entity[Ent].Processing_Channel[e].PayoutRoutingRulesSetup = { "PAYOUT_ROUTING_RULES": "NOT CONFIGURED", "Payout_Routing_Rules_ID": err.data };
        }
        try {
            //Configure Payout Schedule
            console.log("Create Payout Schedule")
            CreatePayoutSchedule = await CATProcessingChannel.Create_Payout_Schedules(Bearer, EntityID, ProcessingChannelName, CurrencyAccountID)
            PayoutScheduleID = CreatePayoutSchedule.data.id
            finalresult.Entity[Ent].Processing_Channel[e].PayoutScheduleSetup = { "PAYOUT_SCHEDULE": "CONFIGURED", "Payout_Schedule_ID": CreatePayoutSchedule.data.id };
            waitfor.delay(body.delay);
        }
        catch (err) {
            finalresult.Entity[Ent].Processing_Channel[e].PayoutScheduleSetup = { "PAYOUT_SCHEDULE": "NOT CONFIGURED", "Payout_Schedule_ID": err.data };
        }
    }
    catch (err) {
        finalresult.Entity[Ent].Processing_Channel[e].CurrencyAccountSetup = { "CURRENCY_ACCOUNT": "NOT CONFIGURED", "Currency_Account_ID": err.data };
    }
}
async function CreateProcessingChannel(Bearer, ClientID, EntityID, ProcessingChannelName) {
    try {
        try {
            //GetVaultID
            console.log("Get Vault ID");
            GetVaultId = await CATEntity.GetEntityDetails(Bearer, EntityID);
            VaultID = GetVaultId.data.services[1].key;
            console.log("Vault ID", VaultID);
        }
        catch (err) { console.log(err); return err }
        ProcessingChannelResult = await CATProcessingChannel.CreateProcessingChannel(Bearer, ClientID, EntityID, ProcessingChannelName, VaultID)
        ProcessingChannelID = ProcessingChannelResult.data.id;
        try {
            CreateSessionProcessingChannelResult = await CATProcessingChannel.Create_Session_Processing_Channels(Bearer, EntityID, ProcessingChannelID, VaultID);
            console.log(CreateSessionProcessingChannelResult)
            //return to be added
        }
        catch (err) {
            console.log(err)
            return err
        }
    }
    catch (err) {
        console.log(err);
        return err
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