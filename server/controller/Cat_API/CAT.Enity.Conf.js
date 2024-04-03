const CATEntity = require('./CAT.Entity.CAT_API');
const CATProcessingChannel = require('./CAT.ProcessingChannelConf');
const waitfor = require('../IdempotencyKey');
const CatConfigInt = require('./CAT.ConfigInt');
const CatPaymentMethodConfig = require('./CAT.PaymentMethodCONF');
const CKOSASTEMPLATE = require('../../ConfTemplates/CKOSAS.json');
const CKOLTDTEMPLATE = require('../../ConfTemplates/CKOLTD.json');
const loggerInfo = require('../../Utils/logger').loggerInfo;
const loggerError = require('../../Utils/logger').loggerError;


async function NewEntity(body) {

}
async function ExistingEntity(body,i) {
    console.log(`Entity already created: ${body.Entity[i].EntityID}`);
    loggerInfo.log('error', `Entity already created: ${body.Entity[i].EntityID}`, "CAT_API");
    try {
        //Get Entity Details
        EntityResult = await CATEntity.GetEntityData(body.Bearer, body.Entity[i].EntityID);
        console.log(`CKO legal entity: ${EntityResult.data.cko_legal_entity}`);
        //get the entity data
        finalresult.Entity.push({ "Entity_Name": EntityResult.data.name, "EntityID": EntityResult.data.id, "status": EntityResult.data.status });
        //set the template for other creations
        if (EntityResult.data.cko_legal_entity === "cko-sas") {
            CKOTEMPLATE = CKOSASTEMPLATE;
        }
        else if (EntityResult.data.cko_legal_entity === "cko-ltd-uk") {
            CKOTEMPLATE = CKOLTDTEMPLATE;
        }
        //Check if one Pricing Profile exist
        try {
            //get available pricing profiles
            PricingProfileResult = await CATEntity.GetPricingProfile(body.Bearer, body.Entity[i].EntityID);
            if (PricingProfileResult.data.total_count > 1) {
                console.log("NB of pricing profile :", PricingProfileResult.data.total_count.length)
                //If Pricing Profile exist and there is more than one, then list them
                finalresult.Entity[i].Pricing_Profile_ID = [];
                for (let ProcessingProfileNumber = 0; ProcessingProfileNumber < PricingProfileResult.data._embedded.pricing_profiles.length; ProcessingProfileNumber++) {
                    finalresult.Entity[i].Pricing_Profile_ID.push(PricingProfileResult.data._embedded.pricing_profiles[ProcessingProfileNumber].id);
                }
            }
            else if (PricingProfileResult.data.total_count === 1) {
                console.log("Pricing Profile ID already exist:", PricingProfileResult.data._embedded.pricing_profiles[0].id)
                //If Pricing Profile exist and there is one, then list it
                finalresult.Entity[i].Pricing_Profile_ID = PricingProfileResult.data._embedded.pricing_profiles[0].id;
            }
            else {
                //If Pricing Profile dosen't exist, then create it
                try {
                    console.log("Create Pricing Profile")
                    CreatePricingProfile = await CATEntity.Create_Pricing_Profile(body.Bearer, body.Entity[i].EntityID, body.Entity[i].EntityName, CKOTEMPLATE);
                    console.log(CreatePricingProfile)
                    finalresult.Entity[i].Pricing_Profile_ID = CreatePricingProfile.data.id;
                }
                catch (err) {
                    console.log(err)
                    finalresult.Entity[i].Pricing_Profile_ID = err.data;
                }
            };
        }
        catch (err) {
            console.log("Pricing profile NOT created :", err)
            finalresult.Entity[i].Pricing_Profile_ID = err
        }
        try {
            //get list of APM pricing profile
            APMPricingProfileResult = await CATEntity.GetAPMPricingProfile(body.Bearer, body.Entity[i].EntityID);
            //console.log(APMPricingProfileResult.hasOwnProperty("data"))
            if (APMPricingProfileResult.data?.id) {
                //If Pricing Profile exist and there is one, then list it
                finalresult.Entity[i].APM_Pricing_Profile_ID = PricingProfileResult.data._embedded.pricing_profiles[0].id;
                console.log("APM Pricing Profil already exist :", PricingProfileResult.data._embedded.pricing_profiles[0].id);
            }
            else {
                //If Pricing Profile dosen't exist, then create it
                console.log("Create APM Pricing Profile")
                CreateAPMPricingProfile = await CATEntity.Create_AMP_Pricing_Profile(body.Bearer, body.Entity[i].EntityID, body.Entity[i].EntityName, CKOTEMPLATE);
                finalresult.Entity[i].APM_Pricing_Profile_ID = CreateAPMPricingProfile.data.id;
            };
        } catch (err) {
            console.log("APM Pricing profile NOT created :", err)
            finalresult.Entity[i].APM_Pricing_Profile_ID = err
        }
        //check if a default routing rules for payment exist 
        try {
            //Get routing rules list 
            RoutingPaymentRulesList = await CATEntity.GetPaymentRoutingRule(body.Bearer, body.Entity[i].EntityID);
            if (RoutingPaymentRulesList.data.total_count > 0) {

            }
            else {
                //Configure Defaut Routing payment rules
                loggerInfo.log(`info`, `Create DEFAUT routing payment rules for ${EntityID} and CurrencyAccount : ${CurrencyAccountID}`, `CAT_API`);
                console.log(`Create DEFAUT routing payment rules for ${EntityID} and CurrencyAccount : ${CurrencyAccountID}`);
                CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(Bearer, EntityID, ProcessingChannelID, CurrencyAccountID, true)
                RoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
                ConfigureProcessingChannelResult.Payment_Routing_Rules_ID = RoutingPaymentRulesID;
                waitfor.delay(delay);
            }
        }
        catch (err) {
            return { "Payment_Routing_Rules_ID": err }
        }
    } catch (err) {
        finalresult.Entity.push({ "Entity_Name": body.Entity[i].EntityName, "EntityID": "ERROR", "status": err });
    }
}

module.exports = {
    NewEntity,
    ExistingEntity
}