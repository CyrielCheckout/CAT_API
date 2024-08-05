const CatConfigInt = require('../../[Batch]PaymentMethod_Configuration');
const CATProcessingChannel = require('../../[CAT]ProcessingChannel_API');
const logger = require('../../../../Utils/logger').logger;
const PayloadConf = require('../../../TemplateSet');
const Payfac_Regulated_CONF = require('../../CAT_Request_Template/Payfac_Regulated_CONF.json');
const waitfor = require('../../../IdempotencyKey');

async function ConfProcessingProfile(Bearer, CKOLEGALENTITY, PaymentMethodToConf, EntityID, EntityName, Countries, MCC) {
    ProcessingProfile = {};
    if (PaymentMethodToConf.includes('VISA')) {
        if ((/\s/g).test(EntityName)) {
            var EntityName = EntityName.replace(/\s/g, '_');
            logger.info(`Removing space of Processing Profile name :  ${EntityName}`, { source: "ConfProcessingProfile_Visa" });
        }
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureCardProcessingProfile(CKOLEGALENTITY, EntityName, "visa", Payfac_Regulated_CONF.ProcessingProfile_Visa, MCC);
            logger.info(`Create Visa Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_Visa" });
            CreateProcessingProfile = await CATProcessingChannel.Create_Card_Processing_profile(Bearer, EntityID, Payload, MCC)
            ProcessingProfileID = CreateProcessingProfile.data.id
            ProcessingProfile.VISA = ProcessingProfileID;
        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_Visa" });
            ProcessingProfile.VISA = err;
        }
    }
    //Configure Mastercard
    if (PaymentMethodToConf.includes('MASTERCARD')) {
        if ((/\s/g).test(EntityName)) {
            var EntityName = EntityName.replace(/\s/g, '_');
            logger.info(`Removing space of Processing Profile name :  ${EntityName}`, { source: "ConfProcessingProfile_MASTERCARD" });
        }
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureCardProcessingProfile(CKOLEGALENTITY, EntityName, "mc", Payfac_Regulated_CONF.ProcessingProfile_mc, MCC);
            logger.info(`Create MASTERCARD Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_MASTERCARD" });
            CreateProcessingProfile = await CATProcessingChannel.Create_Card_Processing_profile(Bearer, EntityID, Payload, MCC)
            ProcessingProfileID = CreateProcessingProfile.data.id
            ProcessingProfile.MASTERCARD = ProcessingProfileID;
        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_MASTERCARD" });
            ProcessingProfile.MASTERCARD = err;
        }
    }
    //Configure Cartes_Bancaires
    if (PaymentMethodToConf.includes('CARTES_BANCAIRES') && CKOLEGALENTITY === "cko-sas") {
        if ((/\s/g).test(EntityName)) {
            var EntityName = EntityName.replace(/\s/g, '_');
            logger.info(`Removing space of Processing Profile name :  ${EntityName}`, { source: "ConfProcessingProfile_CARTES_BANCAIRES" });
        }
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureCardProcessingProfile(CKOLEGALENTITY, EntityName, "cb", Payfac_Regulated_CONF.ProcessingProfile_cb, MCC);
            logger.info(`Create CARTES_BANCAIRES Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_CARTES_BANCAIRES" });
            CreateProcessingProfile = await CATProcessingChannel.Create_Card_Processing_profile(Bearer, EntityID, Payload, MCC)
            ProcessingProfileID = CreateProcessingProfile.data.id
            ProcessingProfile.CARTES_BANCAIRES = ProcessingProfileID;
        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_CARTES_BANCAIRES" });
            ProcessingProfile.CARTES_BANCAIRES = err;
        }
    }
    else {
        ProcessingProfile.CARTES_BANCAIRES = "CB can only be configured on CKO-SAS legal entity"
    }
    //Configure AMEX
    if (PaymentMethodToConf.includes('AMEX')) {
        if ((/\s/g).test(EntityName)) {
            var EntityName = EntityName.replace(/\s/g, '_');
            logger.info(`Removing space of Processing Profile name :  ${EntityName}`, { source: "ConfProcessingProfile_AMEX" });
        }
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureCardProcessingProfile(CKOLEGALENTITY, EntityName, "amex", Payfac_Regulated_CONF.ProcessingProfile_amex, MCC);
            logger.info(`Create AMEX Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_AMEX" });
            CreateProcessingProfile = await CATProcessingChannel.Create_Card_Processing_profile(Bearer, EntityID, Payload, MCC)
            ProcessingProfileID = CreateProcessingProfile.data.id
            ProcessingProfile.AMEX = ProcessingProfileID;
        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_AMEX" });
            ProcessingProfile.AMEX = err;
        }
    }
    return ProcessingProfile
}

async function ConfPaymentMethod(Bearer, ProcessingchannelMatrix, CKOLEGALENTITY, PaymentMethodToConf, EntityID, EntityName, ProcessingProfilesConfResult,PayfacPrefix, MCC) {
    PaymentMethodConfiguration = [];
    if ((/\s/g).test(EntityName)) {
        var ProcessingChannelName = EntityName.replace(/\s/g, '_');
        logger.info(`Removing space of processing channel name :  ${ProcessingChannelName}`, { source: "ConfPaymentMethod" });
    }
    else { ProcessingChannelName = EntityName }
    for (ConfPaymentMethodPayfac = 0; ConfPaymentMethodPayfac < ProcessingchannelMatrix.length; ConfPaymentMethodPayfac++) {
        ProcessingChannelID = ProcessingchannelMatrix[ConfPaymentMethodPayfac].Processing_Channel_Id;
        if (PaymentMethodToConf.includes('VISA')) {
            try {
                //Create Gateway Processor Profile
                Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingChannelName, ProcessingProfilesConfResult.VISA, "visa", Payfac_Regulated_CONF.GatewayProcessorVisa,PayfacPrefix, MCC[ConfPaymentMethodPayfac]);
                logger.info(`Create Visa Gateway Processor for ${ProcessingChannelName})`, { source: "CreateVisaPaymentMethod" });
                CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingchannelMatrix[ConfPaymentMethodPayfac].Processing_Channel_Id, Payload);
                GatewayProcessorId = CreateGatewayProcessor.data.id;
                try {
                    //Create Session Processor Profile
                    Payload = PayloadConf.configureCardAuthenticationGatewayProcessor(GatewayProcessorId, ProcessingProfilesConfResult.VISA,"visa", MCC[ConfPaymentMethodPayfac]);
                    logger.info(`Create Visa Authentication Gateway Processor for ${ProcessingChannelName} `, { source: "CreateVisaPaymentMethod" });
                    CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor(Bearer, ProcessingchannelMatrix[ConfPaymentMethodPayfac].Processing_Channel_Id, Payload);
                    ProcessingchannelMatrix[ConfPaymentMethodPayfac].VISA = { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.VISA, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
                }
                catch (err) {
                    logger.error(`Error while creating Session processor : ${err}`, { source: "CreateVisaPaymentMethod" });
                    ProcessingchannelMatrix[ConfPaymentMethodPayfac].VISA = { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.VISA, "Gateway_Processor": GatewayProcessorId, "Authentication_Gateway_Processor": err };
                }
            }
            catch (err) {
                logger.error(`Error while creating Gateway processor : ${err}`, { source: "CreateVisaPaymentMethod" });
                ProcessingchannelMatrix[ConfPaymentMethodPayfac].VISA = { "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.VISA, "Gateway_Processor": err };
            }
        };
        if (PaymentMethodToConf.includes('MASTERCARD')) {
            try {
                //Create Gateway Processor Profile
                Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingChannelName, ProcessingProfilesConfResult.MASTERCARD, "mastercard", Payfac_Regulated_CONF.GatewayProcessorMastercard, PayfacPrefix, MCC[ConfPaymentMethodPayfac]);
                logger.info(`Create Mastercard Gateway Processor for ${ProcessingChannelName} `, { source: "CreateMastercardPaymentMethod" });
                CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingchannelMatrix[ConfPaymentMethodPayfac].Processing_Channel_Id, Payload);
                GatewayProcessorId = CreateGatewayProcessor.data.id;
                try {
                    //Create Session Processor Profile
                    Payload = PayloadConf.configureCardAuthenticationGatewayProcessor(GatewayProcessorId, ProcessingProfilesConfResult.MASTERCARD, "mastercard", MCC[ConfPaymentMethodPayfac]);
                    logger.info(`Create Mastercard Authentication Gateway Processor for ${ProcessingChannelName} `, { source: "CreateMastercardPaymentMethod" });
                    CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor(Bearer, ProcessingchannelMatrix[ConfPaymentMethodPayfac].Processing_Channel_Id, Payload);
                    ProcessingchannelMatrix[ConfPaymentMethodPayfac].MASTERCARD = { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.MASTERCARD, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
                }
                catch (err) {
                    logger.error(`Error while creating Session processor : ${err}`, { source: "CreateMastercardPaymentMethod" });
                    ProcessingchannelMatrix[ConfPaymentMethodPayfac].MASTERCARD={ "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.MASTERCARD, "Gateway_Processor": GatewayProcessorId, "Authentication_Gateway_Processor": err };
                }
            }
            catch (err) {
                logger.error(`Error while creating Gateway processor : ${err}`, { source: "CreateMastercardPaymentMethod" });
                ProcessingchannelMatrix[ConfPaymentMethodPayfac].MASTERCARD ={ "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.MASTERCARD, "Gateway_Processor": err };
            }
        }
        if (PaymentMethodToConf.includes('CARTES_BANCAIRES')) {
            try {
                //Create Gateway Processor Profile
                Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingChannelName, ProcessingProfilesConfResult.CARTES_BANCAIRES, "cartes_bancaires", Payfac_Regulated_CONF.GatewayProcessorCartesBancaires,PayfacPrefix, MCC[ConfPaymentMethodPayfac]);
                logger.info(`Create Mastercard Gateway Processor for ${ProcessingChannelName} `, { source: "CreateCartesBancairesPaymentMethod" });
                CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingchannelMatrix[ConfPaymentMethodPayfac].Processing_Channel_Id, Payload);
                GatewayProcessorId = CreateGatewayProcessor.data.id;
                try {
                    //Create Session Processor Profile
                    Payload = PayloadConf.configureCardAuthenticationGatewayProcessor(GatewayProcessorId, ProcessingProfilesConfResult.CARTES_BANCAIRES, "CARTES_BANCAIRES", MCC[ConfPaymentMethodPayfac]);
                    logger.info(`Create Mastercard Authentication Gateway Processor for ${ProcessingChannelName} `, { source: "CreateCartesBancairesPaymentMethod" });
                    CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor(Bearer, ProcessingchannelMatrix[ConfPaymentMethodPayfac].Processing_Channel_Id, Payload);
                    ProcessingchannelMatrix[ConfPaymentMethodPayfac].CARTES_BANCAIRES = { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.CARTES_BANCAIRES, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
                }
                catch (err) {
                    logger.error(`Error while creating Session processor : ${err}`, { source: "CreateCartesBancairesPaymentMethod" });
                    ProcessingchannelMatrix[ConfPaymentMethodPayfac].CARTES_BANCAIRES={ "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.CARTES_BANCAIRES, "Gateway_Processor": GatewayProcessorId, "Authentication_Gateway_Processor": err };
                }
            }
            catch (err) {
                logger.error(`Error while creating Gateway processor : ${err}`, { source: "CreateCartesBancairesPaymentMethod" });
                ProcessingchannelMatrix[ConfPaymentMethodPayfac].CARTES_BANCAIRES ={ "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.CARTES_BANCAIRES, "Gateway_Processor": err };
            }
        };
        if (PaymentMethodToConf.includes('AMEX')) {
            try {
                //Create Gateway Processor Profile
                Payload = PayloadConf.configureCardGatewayProcessor(CKOLEGALENTITY, ProcessingChannelName, ProcessingProfilesConfResult.AMEX, "amex", Payfac_Regulated_CONF.GatewayProcessorAmex,PayfacPrefix, MCC[ConfPaymentMethodPayfac]);
                logger.info(`Create Amex Gateway Processor for ${ProcessingChannelName} `, { source: "CreateAmexPaymentMethod" });
                CreateGatewayProcessor = await CATProcessingChannel.Create_GatewayProcessor(Bearer, ProcessingchannelMatrix[ConfPaymentMethodPayfac].Processing_Channel_Id, Payload);
                GatewayProcessorId = CreateGatewayProcessor.data.id;
                try {
                    //Create Session Processor Profile
                    Payload = PayloadConf.configureCardAuthenticationGatewayProcessor(GatewayProcessorId, ProcessingProfilesConfResult.AMEX, "AMEX", MCC[ConfPaymentMethodPayfac]);
                    logger.info(`Create Amex Authentication Gateway Processor for ${ProcessingChannelName} `, { source: "CreateAmexPaymentMethod" });
                    CreateSessionProcessor = await CATProcessingChannel.Create_AuthenticationProcessor(Bearer, ProcessingchannelMatrix[ConfPaymentMethodPayfac].Processing_Channel_Id, Payload);
                    ProcessingchannelMatrix[ConfPaymentMethodPayfac].AMEX = { "Status": "CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.AMEX, "Gateway_Processor": CreateGatewayProcessor.data.id, "Session_Processor": CreateSessionProcessor.data.id };
                }
                catch (err) {
                    logger.error(`Error while creating Session processor : ${err}`, { source: "CreateAmexPaymentMethod" });
                    ProcessingchannelMatrix[ConfPaymentMethodPayfac].AMEX={ "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.AMEX, "Gateway_Processor": GatewayProcessorId, "Authentication_Gateway_Processor": err };
                }
            }
            catch (err) {
                logger.error(`Error while creating Gateway processor : ${err}`, { source: "CreateAmexPaymentMethod" });
                ProcessingchannelMatrix[ConfPaymentMethodPayfac].AMEX ={ "Status": "PARTIALLY CONFIGURED", "Processing_Profile": ProcessingProfilesConfResult.AMEX, "Gateway_Processor": err };
            }
        }
    }
    return ProcessingchannelMatrix;
}
module.exports = {
    ConfPaymentMethod,
    ConfProcessingProfile
}