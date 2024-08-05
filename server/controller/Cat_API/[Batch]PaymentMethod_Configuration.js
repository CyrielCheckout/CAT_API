const CATProcessingChannel = require('./[CAT]ProcessingChannel_API');
const waitfor = require('../IdempotencyKey');
const logger = require('../../Utils/logger').logger;
const MoR_CONF = require('../Cat_API/CAT_Request_Template/MoR_CONF.json');
const PayloadConf = require('../TemplateSet');

async function CreateVisaPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOLEGALENTITY) {
    if ((/\s/g).test(ProcessingChannelName)) {
        var ProcessingChannelName = ProcessingChannelName.replace(/\s/g, '_');
        logger.info(`Removing space of processing channel name :  ${ProcessingChannelName}`, { source: "CreateVisaPaymentMethod" });
    }
    try {
        //Create Gateway Processor Profile
        Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingProfilesConfResult.VISA.card_acceptor_trade_name, ProcessingProfilesConfResult.VISA.ProcessingProfileID, "visa", MoR_CONF.GatewayProcessorVisa, null, "0742", ProcessingProfilesConfResult.VISA.CAID);
        logger.info(`Create Visa Gateway Processor for ${ProcessingChannelName}`, { source: "CreateVisaPaymentMethod" });
        CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingChannelID, Payload);
        try {
            //Create Session Processor Profile
            Payload = PayloadConf.configureCardAuthenticationGatewayProcessor(CreateGatewayProcessor.data.id, ProcessingProfilesConfResult.VISA.ProcessingProfileID, "visa", "0742");
            logger.info(`Create Visa Authentication Gateway Processor for ${ProcessingChannelName}`, { source: "CreateVisaPaymentMethod" });
            CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor(Bearer, ProcessingChannelID, Payload);
            return { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.VISA.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
        }
        catch (err) {
            logger.error(`Error while creating Session processor : ${err}`, { source: "CreateVisaPaymentMethod" });
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.VISA.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": err }
        }
    }
    catch (err) {
        logger.error(`Error while creating Gateway processor : ${err}`, { source: "CreateVisaPaymentMethod" });
        return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.VISA.ProcessingProfileID, "Gateway_Processor": err }
    }
}

async function CreateMastercardPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOLEGALENTITY) {
    if ((/\s/g).test(ProcessingChannelName)) {
        var ProcessingChannelName = ProcessingChannelName.replace(/\s/g, '_');
        logger.info(`Removing space of processing channel name :  ${ProcessingChannelName}`, { source: "CreateMastercardPaymentMethod" });
    }
    try {
        //Create Gateway Processor Profile
        Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingProfilesConfResult.MASTERCARD.card_acceptor_trade_name, ProcessingProfilesConfResult.MASTERCARD.ProcessingProfileID, "mastercard", MoR_CONF.GatewayProcessorMastercard, null, "0742", ProcessingProfilesConfResult.MASTERCARD.CAID);
        logger.info(`Create Mastercard Gateway Processor for ${ProcessingChannelName}`, { source: "CreateMastercardPaymentMethod" });
        CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingChannelID, Payload);
        try {
            //Create Session Processor Profile
            Payload = PayloadConf.configureCardAuthenticationGatewayProcessor(CreateGatewayProcessor.data.id, ProcessingProfilesConfResult.MASTERCARD.ProcessingProfileID, "mastercard", "0742");
            logger.info(`Create Mastercard Authentication Gateway Processor for ${ProcessingChannelName}`, { source: "CreateMastercardPaymentMethod" });
            CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor(Bearer, ProcessingChannelID, Payload);
            return { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.MASTERCARD.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
        }
        catch (err) {
            logger.error(`Error while creating Session processor : ${err}`, { source: "CreateMastercardPaymentMethod" });
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.MASTERCARD.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": err }
        }
    }
    catch (err) {
        logger.error(`Error while creating Gateway processor : ${err}`, { source: "CreateMastercardPaymentMethod" });
        return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.MASTERCARD.ProcessingProfileID, "Gateway_Processor": err }
    }
}
async function CreateBancontactPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOLEGALENTITY) {
    try {
        //Create processor Profile
        Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingChannelName, ProcessingProfilesConfResult.BANCONTACT.ProcessingProfileID, "bancontact", MoR_CONF.GatewayProcessorBancontact, null, "0742", ProcessingProfilesConfResult.BANCONTACT.CAID);
        logger.info(`Create Bancontact Gateway Processor for ${ProcessingChannelName}`, { source: "CreateBancontactPaymentMethod" });
        CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingChannelID, Payload);
        return { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.BANCONTACT.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id }
    }
    catch (err) {
        logger.error(`Error while creating Gateway Processor : ${err})`, { source: "CreateBancontactPaymentMethod" });
        return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.BANCONTACT.ProcessingProfileID, "Gateway_Processor": err }
    }
}
async function CreateIdealPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOLEGALENTITY) {
    try {
        //Create processor Profile
        Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingChannelName, ProcessingProfilesConfResult.IDEAL.ProcessingProfileID, "ideal", MoR_CONF.GatewayProcessorIdeal, null, "0742", ProcessingProfilesConfResult.IDEAL.CAID);
        logger.info(`Create Ideal Gateway Processor for ${ProcessingChannelName}`, { source: "CreateIdealPaymentMethod" });
        CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingChannelID, Payload);
        return { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.IDEAL.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id }
    }
    catch (err) {
        logger.error(`Error while creating Gateway Processor : ${err})`, { source: "CreateIdealPaymentMethod" });
        return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.IDEAL.ProcessingProfileID, "Gateway_Processor": err }
    }
}

async function CreateCartesBancairesPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOLEGALENTITY) {
    if (CKOLEGALENTITY === "cko-sas") {
        try {
            //Create Gateway Processor Profile
            Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingProfilesConfResult.CARTES_BANCAIRES.card_acceptor_trade_name, ProcessingProfilesConfResult.CARTES_BANCAIRES.ProcessingProfileID, "cartes_bancaires", MoR_CONF.GatewayProcessorCartesBancaires, null, "0742", ProcessingProfilesConfResult.CARTES_BANCAIRES.CAID);
            logger.info(`Create Cartes Bancaires Gateway Processor for ${ProcessingChannelName}`, { source: "CreateCartesBancairesPaymentMethod" });
            CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingChannelID, Payload);
            try {
                //Create Session Processor Profile
                Payload = PayloadConf.configureCardAuthenticationGatewayProcessor(CreateGatewayProcessor.data.id, ProcessingProfilesConfResult.CARTES_BANCAIRES.ProcessingProfileID, "cartes_bancaires", "0742");
                logger.info(`Create Cartes Bancaires Authentication Gateway Processor for ${ProcessingChannelName}`, { source: "CreateCartesBancairesPaymentMethod" });
                CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor(Bearer, ProcessingChannelID, Payload);
                return { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.CARTES_BANCAIRES.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
            }
            catch (err) {
                logger.error(`Error while creating Session processor : ${err}`, { source: "CreateCartesBancairesPaymentMethod" });
                return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.CARTES_BANCAIRES.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": err }
            }
        }
        catch (err) {
            logger.error(`Error while creating Gateway processor : ${err}`, { source: "CreateCartesBancairesPaymentMethod" });
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.CARTES_BANCAIRES.ProcessingProfileID, "Gateway_Processor": err }
        }
    }
    else {
        return "CB can only be configured on CKO-SAS legal entity"
    }
}
async function CreateAmexPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOLEGALENTITY) {
    try {
        //Create Gateway Processor Profile
        Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingProfilesConfResult.AMEX.card_acceptor_trade_name, ProcessingProfilesConfResult.AMEX.ProcessingProfileID, "amex", MoR_CONF.GatewayProcessorAmex, null, "0742", ProcessingProfilesConfResult.AMEX.CAID);
        logger.info(`Create Cartes Bancaires Gateway Processor for ${ProcessingChannelName}`, { source: "CreateAmexPaymentMethod" });
        CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingChannelID, Payload);
        try {
            //Create Session Processor Profile
            Payload = PayloadConf.configureCardAuthenticationGatewayProcessor(CreateGatewayProcessor.data.id, ProcessingProfilesConfResult.AMEX.ProcessingProfileID, "amex", "0742");
            logger.info(`Create Cartes Bancaires Authentication Gateway Processor for ${ProcessingChannelName}`, { source: "CreateAmexPaymentMethod" });
            CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor(Bearer, ProcessingChannelID, Payload);
            return { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.AMEX.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
        }
        catch (err) {
            logger.error(`Error while creating Session processor : ${err}`, { source: "CreateAmexPaymentMethod" });
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.AMEX.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": err }
        }
    }
    catch (err) {
        logger.error(`Error while creating Gateway processor : ${err}`, { source: "CreateAmexPaymentMethod" });
        return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.AMEX.ProcessingProfileID, "Gateway_Processor": err }
    }
}
async function CreateSepaPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOLEGALENTITY) {
    try {
        //Create processor Profile
        Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingChannelName, ProcessingProfilesConfResult.SEPA.ProcessingProfileID, "sepa", MoR_CONF.GatewayProcessorSepa, null, "0742", ProcessingProfilesConfResult.SEPA.CAID);
        logger.info(`Create Sepa Gateway Processor for ${ProcessingChannelName}`, { source: "CreateSepaPaymentMethod" });
        CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingChannelID, Payload);
        return { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.SEPA.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id }
    }
    catch (err) {
        logger.error(`Error while creating Gateway Processor : ${err})`, { source: "CreateSepaPaymentMethod" });
        return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.SEPA.ProcessingProfileID, "Gateway_Processor": err }
    }
}
async function CreateSofortPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOLEGALENTITY) {
    try {
        //Create processor Profile
        Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingChannelName, ProcessingProfilesConfResult.SOFORT.ProcessingProfileID, "sofort", MoR_CONF.GatewayProcessorSofort, null, "0742", ProcessingProfilesConfResult.SOFORT.CAID);
        logger.info(`Create Sofort Gateway Processor for ${ProcessingChannelName}`, { source: "CreateSofortPaymentMethod" });
        CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingChannelID, Payload);
        return { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.SOFORT.ProcessingProfileID, "Gateway_Processor": CreateGatewayProcessor.data.id }
    }
    catch (err) {
        logger.error(`Error while creating Gateway Processor : ${err})`, { source: "CreateSofortPaymentMethod" });
        return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.SOFORT.ProcessingProfileID, "Gateway_Processor": err }
    }
}
async function CreateKlarnaPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOLEGALENTITY, PaymentMethodSpecificConf) {
    try {
        //Create Processing Profile 
        Payload = PayloadConf.configureAPMProcessingProfile(CKOLEGALENTITY, ProcessingChannelName, "klarna", MoR_CONF.ProcessingProfile_klarna,PaymentMethodSpecificConf);
        logger.info(`Create KLARNA Processing Profile for ${ProcessingChannelName} with Payload : ${Payload}`, { source: "CreateKlarnaPaymentMethod" });
        CreateProcessingProfile = await CATProcessingChannel.CreateAPMProcessingProfile(Bearer, EntityID, Payload);
        try {
            //Create processor Profile
            Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingChannelName, CreateProcessingProfile.data.id, "klarna", MoR_CONF.GatewayProcessorKlarna, null, "0742",CreateProcessingProfile.data.business_settings[0].card_acceptor_identification_code);
            logger.info(`Create Klarna Gateway Processor for ${ProcessingChannelName}`, { source: "CreateKlarnaPaymentMethod" });
            CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingChannelID, Payload);
            return { "Status": "CONFIGURED", "Processing_Profile": CreateProcessingProfile.data.id, "Gateway_Processor": CreateGatewayProcessor.data.id }
        }
        catch (err) {
            logger.error(`Error while creating Gateway Processor : ${err})`, { source: "CreateKlarnaPaymentMethod_GatewayProcessor" });
            return { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": CreateProcessingProfile.data.id, "Gateway_Processor": err }
        }
    }
    catch (err) {
        logger.error(`Error while creating Processing Profile : ${err}`, { source: "CreateKlarnaPaymentMethod_ProcessingProfile" });
        return { "Status": "NOT CONFIGURED", "Processing_Profile": err}
    }
}
async function ConfigureProcessingChannel(Bearer, EntityID, ProcessingChannelName, delay, CKOLEGALENTITY, i, ProcessingChannelNumber) {
    //Configure Currency Account
    try {
        //Create Currency Account
        logger.info(`Create Currency Account`, { source: "ConfigureProcessingChannel" });
        CreateCurrencyAccount = await CATProcessingChannel.Create_Currency_Account(Bearer, EntityID, ProcessingChannelName, CKOLEGALENTITY)
        CurrencyAccountID = CreateCurrencyAccount.data.id
        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].CurrencyAccount = { "CURRENCY_ACCOUNT": "CONFIGURED", "Currency_Account_ID": CurrencyAccountID };
        waitfor.delay(delay);
        try {
            //Configure Defaut Routing payment rules
            logger.info(`Create routing payment rules for ${EntityID} and CurrencyAccount : ${CurrencyAccountID} and processing channel :${ProcessingChannelID}`, { source: "ConfigureProcessingChannel" });
            CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(Bearer, EntityID, ProcessingChannelID, CurrencyAccountID, false)
            RoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].PaymentRoutingRules = { "PAYMENT_ROUTING_RULES": "CONFIGURED", "Payment_Routing_Rules_ID": RoutingPaymentRulesID };
            waitfor.delay(delay);
        }
        catch (err) {
            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].PaymentRoutingRules = { "PAYMENT_ROUTING_RULES": "NOT CONFIGURED", "Error": err };
        }
        try {
            //Configure Routing payout rules
            logger.info(`Create routing payout rules for ${EntityID} and CurrencyAccount : ${CurrencyAccountID}`, { source: "ConfigureProcessingChannel" });
            CreateRoutingPayoutRules = await CATProcessingChannel.Create_Routing_Rules_Payout(Bearer, EntityID, CurrencyAccountID)
            RoutingPayoutRulesID = CreateRoutingPayoutRules.data.id
            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].RoutingPayoutRules = { "PAYOUT_ROUTING_RULES": "CONFIGURED", "Payout_Routing_Rules_ID": RoutingPayoutRulesID };
            waitfor.delay(delay);
        }
        catch (err) {
            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].RoutingPayoutRules = { "PAYOUT_ROUTING_RULES": "NOT CONFIGURED", "Error": err };
        }
        try {
            //Configure Payout Schedule
            logger.info(`Create Payout Schedule for ${EntityID} and CurrencyAccount : ${CurrencyAccountID}`, { source: "ConfigureProcessingChannel" });
            CreatePayoutSchedule = await CATProcessingChannel.Create_Payout_Schedules(Bearer, EntityID, ProcessingChannelName, CurrencyAccountID, CKOLEGALENTITY)
            PayoutScheduleID = CreatePayoutSchedule.data.id
            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].PayoutSchedule = { "PAYOUT_SCHEDULE": "CONFIGURED", "Payout_Schedule_ID": PayoutScheduleID };
            waitfor.delay(delay);
        }
        catch (err) {
            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].PayoutSchedule = { "PAYOUT_SCHEDULE": "NOT CONFIGURED", "Error": err };
        }
    }
    catch (err) {
        logger.error(`Error while creating currency account ${err}`, { source: "ConfigureProcessingChannel" });
        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].CurrencyAccount = { "CURRENCY_ACCOUNT": "NOT CONFIGURED", "Error": err };
    }
}
async function CreateProcessingChannel(Bearer, ClientID, EntityID, ProcessingChannelName, VaultID) {
    try {
        try {
            Payload = await PayloadConf.configureProcessingChannel(ProcessingChannelName, ClientId, EntityID, VaultID, MoR_CONF.ProcessingChannel);
            //Create Processing channel
            ProcessingChannelResult = await CATProcessingChannel.CreateProcessingChannel(Bearer, EntityID, Payload);
            ProcessingChannelID = ProcessingChannelResult.data.id;
            logger.info(`Processing channel ID Created : ${ProcessingChannelID}`, { source: "CreateProcessingChannel" });
        }
        catch (err) {
            logger.error(`Error while creating processing channel :${err}`, { source: "CreateProcessingChannel" });
            return err
        }
        try {
            CreateSessionProcessingChannelResult = await CATProcessingChannel.Create_Session_Processing_Channels(Bearer, EntityID, ProcessingChannelID, VaultID);
            logger.info(`Session Processing Channel created : ${ProcessingChannelID}`, { source: "CreateProcessingChannel" });

            return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": ProcessingChannelID }
        }
        catch (err) {
            try {
                console.log("RETRY")
                console.log("Wait for 20000 MS")
                waitfor.delay(20000);
                CreateSessionProcessingChannelResult = await CATProcessingChannel.Create_Session_Processing_Channels(Bearer, EntityID, ProcessingChannelID, VaultID);
                console.log("Session Processing Channel created :", ProcessingChannelID)
                logger.info(`Session Processing Channel created : ${ProcessingChannelID}`, { source: "CreateProcessingChannel" });

                return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": ProcessingChannelID }
            }
            catch {
                logger.error(`Error while creating Session Processing channel: ${err}`, { source: "CreateProcessingChannel" });
                return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": err }
            }

        }
    }
    catch (err) {
        logger.error(`Error while creating processing channel ${err}`, { source: "CreateProcessingChannel" });
        return { "Processing_Channel_ID": err, "Session_Processing_Channel_ID": err }
    }

}
module.exports = {
    CreateProcessingChannel,
    CreateVisaPaymentMethod,
    CreateAmexPaymentMethod,
    CreateMastercardPaymentMethod,
    CreateBancontactPaymentMethod,
    CreateIdealPaymentMethod,
    CreateCartesBancairesPaymentMethod,
    CreateSepaPaymentMethod,
    ConfigureProcessingChannel,
    CreateSofortPaymentMethod,
    CreateKlarnaPaymentMethod
}