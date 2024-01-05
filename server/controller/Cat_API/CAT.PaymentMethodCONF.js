const CATEntity = require('./CAT.EntityConf');
const CATProcessingChannel = require('./CAT.ProcessingChannelConf');
const waitfor = require('../IdempotencyKey');
const CatConfigInt = require('../Cat_API/CAT.ConfigInt');

async function ConfPaymentMethod(PaymentMethodToConf,Bearer,EntityID,ProcessingChannelID,ProcessingChannelName) {
    PaymentMethodConf = {};
    //Configure Visa
    if (PaymentMethodToConf.includes('VISA')) {
        console.log("Create VISA")
        try {
            VISACONF = await CatConfigInt.CreateVisaPaymentMethod(Bearer, ProcessingChannelID, ProcessingChannelName);
            PaymentMethodConf.VISASetup = { "VISA": "CONFIGURED", "Processing_Profile_ID": VISACONF.Processing_profile, "Session_Processor": VISACONF.Session_Processor };
        }
        catch (err) {
            console.log(err)
            PaymentMethodConf.VISASetup = { "VISA": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
        }
    }
    //Configure Mastercard
    if (PaymentMethodToConf.includes('MASTERCARD')) {
        console.log("Create Mastercard")
        try {
            MASTERCARDCONF = await CatConfigInt.CreateMastercardPaymentMethod(Bearer, ProcessingChannelID, ProcessingChannelName);
            PaymentMethodConf.MASTERCARDSetup = { "MASTERCARD": "CONFIGURED", "Processing_Profile_ID": MASTERCARDCONF.Processing_profile, "Session_Processor": MASTERCARDCONF.Session_Processor };
        }
        catch (err) {
            console.log(err)
            PaymentMethodConf.MASTERCARDSetup = { "MASTERCARD": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
        }
    }
    //Configure Bancontact
    if (PaymentMethodToConf.includes('BANCONTACT')) {
        console.log("Create BANCONTACT")
        try {
            BANCONTACTONF = await CatConfigInt.CreateBancontactPaymentMethod(Bearer,EntityID, ProcessingChannelID, ProcessingChannelName);
            PaymentMethodConf.BANCONTACTSetup = { "BANCONTACT": "CONFIGURED", "Processing_Profile_ID": BANCONTACTONF.Processing_Profile, "Processing_Processor_ID": BANCONTACTONF.Processor_Profile };
        }
        catch (err) {
            console.log(err)
            PaymentMethodConf.BANCONTACTSetup = { "BANCONTACT": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
        }
    }
    
    //Configure Ideal
    if (PaymentMethodToConf.includes('IDEAL')) {
        console.log("Create IDEAL")
        try {
            IDEALCONF = await CatConfigInt.CreateIdealPaymentMethod(Bearer,EntityID, ProcessingChannelID, ProcessingChannelName);
            PaymentMethodConf.IDEALSetup = { "IDEAL": "CONFIGURED", "Processing_Profile_ID": IDEALCONF.Processing_Profile, "Processing_Processor_ID": IDEALCONF.Processor_Profile };
        }
        catch (err) {
            console.log(err)
            PaymentMethodConf.IDEALSetup = { "IDEAL": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
        }
    }
    

    //Configure Cartes_Bancaires
    if (PaymentMethodToConf.includes('CARTES_BANCAIRES')) {
        console.log("Create CARTES_BANCAIRES")
        try {
            CARTES_BANCAIRESCONF = await CatConfigInt.CreateCartesBancairesPaymentMethod(Bearer, EntityID,ProcessingChannelID, ProcessingChannelName);
            PaymentMethodConf.CARTES_BANCAIRESSetup = { "CARTES_BANCAIRES": "CONFIGURED", "Processing_Profile_ID": CARTES_BANCAIRESCONF.Processing_Profile, "Processor_Profile_ID": CARTES_BANCAIRESCONF.Processor_Profile, "Session_Processor_ID":CARTES_BANCAIRESCONF.Session_Processor };
        }
        catch (err) {
            console.log(err)
            PaymentMethodConf.CARTES_BANCAIRESSetup = { "CARTES_BANCAIRES": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
        }
    }

    //Configure SEPA
    if (PaymentMethodToConf.includes('SEPA')) {
        console.log("Create SEPA")
        try {
            SEPACONF = await CatConfigInt.CreateSepaPaymentMethod(Bearer,EntityID, ProcessingChannelID, ProcessingChannelName);
            PaymentMethodConf.SEPASetup = { "SEPA": "CONFIGURED", "Processing_Profile_ID": SEPACONF.Processing_Profile, "Processing_Processor_ID": SEPACONF.Processor_Profile };
        }
        catch (err) {
            console.log(err)
            PaymentMethodConf.SEPASetup = { "SEPA": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
        }
    }
    return PaymentMethodConf
}

module.exports = {
    ConfPaymentMethod
}