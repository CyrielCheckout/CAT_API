const CatConfigInt = require('./[Batch]PaymentMethod_Configuration');
const logger = require('../../Utils/logger').logger;
const MoR_CONF = require('../Cat_API/CAT_Request_Template/MoR_CONF.json');
const PayloadConf = require('../TemplateSet');
const CATEntity = require('../Cat_API/[CAT]Entity_API');
const CATProcessingChannel = require('../Cat_API/[CAT]ProcessingChannel_API');
const waitfor = require('../IdempotencyKey');

async function ConfProcessingProfile(Bearer, CKOLEGALENTITY, PaymentMethodToConf, EntityID, EntityName, Countries, MCC) {
    ProcessingProfile = {};
    if (PaymentMethodToConf.includes('VISA')) {
        if ((/\s/g).test(EntityName)) {
            var EntityName = EntityName.replace(/\s/g, '_');
            logger.info(`Removing space of Processing Profile name :  ${EntityName}`, { source: "ConfProcessingProfile_Visa" });
        }
        if (EntityName.length > 22) {
            EntityNameslice = EntityName.slice(0, 25);
        }
        else { EntityNameslice = EntityName; }
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureCardProcessingProfile(CKOLEGALENTITY, EntityNameslice, "visa", MoR_CONF.ProcessingProfile_Visa, null);
            logger.info(`Create Visa Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_Visa" });
            CreateProcessingProfile = await CATProcessingChannel.Create_Card_Processing_profile(Bearer, EntityID, Payload)
            ProcessingProfileID = CreateProcessingProfile.data.id
            ProcessingProfile.VISA = { ProcessingProfileID: CreateProcessingProfile.data.id, card_acceptor_trade_name: CreateProcessingProfile.data.card_acceptor_trade_name, CAID: CreateProcessingProfile.data.business_settings[0].card_acceptor_identification_code };
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
        if (EntityName.length > 22) {
            EntityNameslice = EntityName.slice(0, 22);
        }
        else { EntityNameslice = EntityName; }
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureCardProcessingProfile(CKOLEGALENTITY, EntityNameslice, "mc", MoR_CONF.ProcessingProfile_mc, null);
            logger.info(`Create MASTERCARD Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_MASTERCARD" });
            CreateProcessingProfile = await CATProcessingChannel.Create_Card_Processing_profile(Bearer, EntityID, Payload)
            ProcessingProfileID = CreateProcessingProfile.data.id
            ProcessingProfile.MASTERCARD = { ProcessingProfileID: CreateProcessingProfile.data.id, card_acceptor_trade_name: CreateProcessingProfile.data.card_acceptor_trade_name, CAID: CreateProcessingProfile.data.business_settings[0].card_acceptor_identification_code };
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
            Payload = PayloadConf.configureCardProcessingProfile(CKOLEGALENTITY, EntityName, "cb", MoR_CONF.ProcessingProfile_cb, null);
            logger.info(`Create CARTES_BANCAIRES Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_CARTES_BANCAIRES" });
            CreateProcessingProfile = await CATProcessingChannel.Create_Card_Processing_profile(Bearer, EntityID, Payload)
            ProcessingProfileID = CreateProcessingProfile.data.id
            ProcessingProfile.CARTES_BANCAIRES = { ProcessingProfileID: CreateProcessingProfile.data.id, card_acceptor_trade_name: CreateProcessingProfile.data.card_acceptor_trade_name, CAID: CreateProcessingProfile.data.business_settings[0].card_acceptor_identification_code };
        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_CARTES_BANCAIRES" });
            ProcessingProfile.CARTES_BANCAIRES = err;
        }
    }
    //Configure AMEX
    if (PaymentMethodToConf.includes('AMEX')) {
        if ((/\s/g).test(EntityName)) {
            var EntityName = EntityName.replace(/\s/g, '_');
            logger.info(`Removing space of Processing Profile name :  ${EntityName}`, { source: "ConfProcessingProfile_AMEX" });
        }
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureCardProcessingProfile(CKOLEGALENTITY, EntityName, "amex", MoR_CONF.ProcessingProfile_amex, null);
            logger.info(`Create AMEX Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_AMEX" });
            CreateProcessingProfile = await CATProcessingChannel.Create_Card_Processing_profile(Bearer, EntityID, Payload)
            ProcessingProfileID = CreateProcessingProfile.data.id
            ProcessingProfile.AMEX = { ProcessingProfileID: CreateProcessingProfile.data.id, card_acceptor_trade_name: CreateProcessingProfile.data.card_acceptor_trade_name, CAID: CreateProcessingProfile.data.business_settings[0].card_acceptor_identification_code };
        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_AMEX" });
            ProcessingProfile.AMEX = err;
        }
    };
    //Configure Bancontact
    if (PaymentMethodToConf.includes('BANCONTACT')) {
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureAPMProcessingProfile(CKOLEGALENTITY, EntityName, "bancontact", MoR_CONF.ProcessingProfile_bancontact);
            logger.info(`Create BANCONTACT Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_BANCONTACT" });
            CreateProcessingProfile = await CATProcessingChannel.CreateAPMProcessingProfile(Bearer, EntityID, Payload);
            ProcessingProfileID = CreateProcessingProfile.data.id
            ProcessingProfile.BANCONTACT = { ProcessingProfileID: CreateProcessingProfile.data.id, card_acceptor_trade_name: CreateProcessingProfile.data.card_acceptor_trade_name, CAID: CreateProcessingProfile.data.business_settings[0].card_acceptor_identification_code };
        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_BANCONTACT" });
            ProcessingProfile.BANCONTACT = err;
        }
    }

    //Configure Ideal
    if (PaymentMethodToConf.includes('IDEAL')) {
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureAPMProcessingProfile(CKOLEGALENTITY, EntityName, "ideal", MoR_CONF.ProcessingProfile_ideal);
            logger.info(`Create IDEAL Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_IDEAL" });
            CreateProcessingProfile = await CATProcessingChannel.CreateAPMProcessingProfile(Bearer, EntityID, Payload);
            ProcessingProfile.IDEAL = { ProcessingProfileID: CreateProcessingProfile.data.id, card_acceptor_trade_name: CreateProcessingProfile.data.card_acceptor_trade_name, CAID: CreateProcessingProfile.data.business_settings[0].card_acceptor_identification_code };

        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_IDEAL" });
            ProcessingProfile.IDEAL = err;
        }
    }
    //Configure SEPA
    if (PaymentMethodToConf.includes('SEPA')) {
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureAPMProcessingProfile(CKOLEGALENTITY, EntityName, "sepa", MoR_CONF.ProcessingProfile_sepa);
            logger.info(`Create SEPA Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_SEPA" });
            CreateProcessingProfile = await CATProcessingChannel.CreateAPMProcessingProfile(Bearer, EntityID, Payload);
            ProcessingProfile.SEPA = { ProcessingProfileID: CreateProcessingProfile.data.id, card_acceptor_trade_name: CreateProcessingProfile.data.card_acceptor_trade_name, CAID: CreateProcessingProfile.data.business_settings[0].card_acceptor_identification_code };

        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_SEPA" });
            ProcessingProfile.SEPA = err;
        }
    }
    //Configure SOFORT
    if (PaymentMethodToConf.includes('SOFORT')) {
        try {
            //Create Processing Profile 
            Payload = PayloadConf.configureAPMProcessingProfile(CKOLEGALENTITY, EntityName, "sofort", MoR_CONF.ProcessingProfile_sofort);
            logger.info(`Create SOFORT Processing Profile for ${EntityName} with Payload : ${Payload}`, { source: "ConfProcessingProfile_SOFORT" });
            CreateProcessingProfile = await CATProcessingChannel.CreateAPMProcessingProfile(Bearer, EntityID, Payload);
            ProcessingProfile.SOFORT = { ProcessingProfileID: CreateProcessingProfile.data.id, card_acceptor_trade_name: CreateProcessingProfile.data.card_acceptor_trade_name, CAID: CreateProcessingProfile.data.business_settings[0].card_acceptor_identification_code };
        }
        catch (err) {
            logger.error(`Error while creating Processing Profile : ${err}`, { source: "ConfProcessingProfile_SOFORT" });
            ProcessingProfile.SOFORT = err;
        }
    }
    return ProcessingProfile
}

async function ConfPaymentMethod(Bearer, PaymentMethodToConf, EntityID, ProcessingChannelID, EntityName,ProcessingChannelName, ProcessingProfilesConfResult, CKOTEMPLATE,PaymentMethodSpecificConf) {
    PaymentMethodConf = {};
    //Configure Visa
    if (PaymentMethodToConf.includes('VISA')) {
        logger.info(`Create VISA`, { source: "ConfPaymentMethod" });
        VISACONF = await CatConfigInt.CreateVisaPaymentMethod(Bearer, EntityID, ProcessingChannelID, EntityName, ProcessingProfilesConfResult, CKOTEMPLATE);
        PaymentMethodConf.VISA = VISACONF;
    }
    //Configure Mastercard
    if (PaymentMethodToConf.includes('MASTERCARD')) {
        logger.info(`Create Mastercard`, { source: "ConfPaymentMethod" });
        MASTERCARDCONF = await CatConfigInt.CreateMastercardPaymentMethod(Bearer, EntityID, ProcessingChannelID, EntityName, ProcessingProfilesConfResult, CKOTEMPLATE);
        PaymentMethodConf.MASTERCARD = MASTERCARDCONF;
    }
    //Configure Bancontact
    if (PaymentMethodToConf.includes('BANCONTACT')) {
        logger.info(`Create BANCONTACT`, { source: "ConfPaymentMethod" });
        BANCONTACTONF = await CatConfigInt.CreateBancontactPaymentMethod(Bearer, EntityID, ProcessingChannelID, EntityName, ProcessingProfilesConfResult, CKOTEMPLATE);
        PaymentMethodConf.BANCONTACT = BANCONTACTONF;
    }

    //Configure Ideal
    if (PaymentMethodToConf.includes('IDEAL')) {
        logger.info(`Create IDEAL`, { source: "ConfPaymentMethod" });
        IDEALCONF = await CatConfigInt.CreateIdealPaymentMethod(Bearer, EntityID, ProcessingChannelID, EntityName, ProcessingProfilesConfResult, CKOTEMPLATE);
        PaymentMethodConf.IDEAL = IDEALCONF;
    }
    //Configure Cartes_Bancaires
    if (PaymentMethodToConf.includes('CARTES_BANCAIRES')) {
        logger.info(`Create CARTES_BANCAIRES`, { source: "ConfPaymentMethod" });
        CARTES_BANCAIRESCONF = await CatConfigInt.CreateCartesBancairesPaymentMethod(Bearer, EntityID, ProcessingChannelID, EntityName, ProcessingProfilesConfResult, CKOTEMPLATE);
        PaymentMethodConf.CARTES_BANCAIRES = CARTES_BANCAIRESCONF;

    }
    //Configure AMEX
    if (PaymentMethodToConf.includes('AMEX')) {
        logger.info(`Create AMEX`, { source: "ConfPaymentMethod" });
        AMEXCONF = await CatConfigInt.CreateAmexPaymentMethod(Bearer, EntityID, ProcessingChannelID, EntityName, ProcessingProfilesConfResult, CKOTEMPLATE);
        PaymentMethodConf.AMEX = AMEXCONF;
    }

    //Configure SEPA
    if (PaymentMethodToConf.includes('SEPA')) {
        logger.info(`Create SEPA`, { source: "ConfPaymentMethod" });
        SEPACONF = await CatConfigInt.CreateSepaPaymentMethod(Bearer, EntityID, ProcessingChannelID, EntityName, ProcessingProfilesConfResult);
        PaymentMethodConf.SEPA = SEPACONF;
    }
    //Configure SOFORT
    if (PaymentMethodToConf.includes('SOFORT')) {
        logger.info(`Create SOFORT`, { source: "ConfPaymentMethod" });
        SOFORTCONF = await CatConfigInt.CreateSofortPaymentMethod(Bearer, EntityID, ProcessingChannelID, EntityName, ProcessingProfilesConfResult, CKOTEMPLATE);
        PaymentMethodConf.SOFORT = SOFORTCONF;
    }
    //Configure KLARNA
    if (PaymentMethodToConf.includes('KLARNA')) {
        if (PaymentMethodSpecificConf.KLARNA) {
            logger.info(`Create KLARNA`, { source: "ConfPaymentMethod" });
            KLARNACONF = await CatConfigInt.CreateKlarnaPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, ProcessingProfilesConfResult, CKOTEMPLATE,PaymentMethodSpecificConf.KLARNA);
            PaymentMethodConf.KLARNA = KLARNACONF;
        }
        else{
            PaymentMethodConf.KLARNA = "KLARNA Settings are missing and can't be configured"
        }
    }
    return PaymentMethodConf
}

module.exports = {
    ConfPaymentMethod,
    ConfProcessingProfile
}