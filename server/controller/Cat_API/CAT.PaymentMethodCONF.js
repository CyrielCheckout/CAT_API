const CATEntity = require('./CAT.Entity.CAT_API');
const CATProcessingChannel = require('./CAT.ProcessingChannelConf');
const waitfor = require('../IdempotencyKey');
const CatConfigInt = require('../Cat_API/CAT.ConfigInt');

async function ConfPaymentMethod(PaymentMethodToConf, Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE) {
    PaymentMethodConf = {};
    //Configure Visa
    if (PaymentMethodToConf.includes('VISA')) {
        console.log("Create VISA")
        VISACONF = await CatConfigInt.CreateVisaPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE);
        PaymentMethodConf.VISASetup = VISACONF;
    }
    //Configure Mastercard
    if (PaymentMethodToConf.includes('MASTERCARD')) {
        console.log("Create Mastercard")
        MASTERCARDCONF = await CatConfigInt.CreateMastercardPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE);
        PaymentMethodConf.MASTERCARDSetup = MASTERCARDCONF;
    }
    //Configure Bancontact
    if (PaymentMethodToConf.includes('BANCONTACT')) {
        console.log("Create BANCONTACT")
        BANCONTACTONF = await CatConfigInt.CreateBancontactPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName,CKOTEMPLATE);
        PaymentMethodConf.BANCONTACTSetup = BANCONTACTONF;
    }

    //Configure Ideal
    if (PaymentMethodToConf.includes('IDEAL')) {
        console.log("Create IDEAL")
        IDEALCONF = await CatConfigInt.CreateIdealPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName,CKOTEMPLATE);
        PaymentMethodConf.IDEALSetup = IDEALCONF;
    }


    //Configure Cartes_Bancaires
    if (PaymentMethodToConf.includes('CARTES_BANCAIRES')) {
        console.log("Create CARTES_BANCAIRES")
        CARTES_BANCAIRESCONF = await CatConfigInt.CreateCartesBancairesPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE);
        PaymentMethodConf.CARTES_BANCAIRESSetup = CARTES_BANCAIRESCONF;

    }
     //Configure AMEX
     if (PaymentMethodToConf.includes('AMEX')) {
        console.log("Create AMEX")
        AMEXCONF = await CatConfigInt.CreateAmexPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName, CKOTEMPLATE);
        PaymentMethodConf.AMEXSetup = AMEXCONF;
    }

    //Configure SEPA
    if (PaymentMethodToConf.includes('SEPA')) {
        console.log("Create SEPA")
        SEPACONF = await CatConfigInt.CreateSepaPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName);
        PaymentMethodConf.SEPASetup = SEPACONF;
    }
    //Configure GIROPAY
    if (PaymentMethodToConf.includes('GIROPAY')) {
        console.log("Create GIROPAY")
        GIROPAYCONF = await CatConfigInt.CreateGiroPayPaymentMethod(Bearer, EntityID, ProcessingChannelID, ProcessingChannelName,CKOTEMPLATE);
        PaymentMethodConf.GIROPAYSetup = GIROPAYCONF;
    }
    return PaymentMethodConf
}

module.exports = {
    ConfPaymentMethod
}