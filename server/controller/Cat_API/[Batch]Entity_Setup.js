const CATEntity = require('./[CAT]Entity_API');
const CATProcessingChannel = require('./[CAT]ProcessingChannel_API');
const waitfor = require('../IdempotencyKey');
const logger = require('../../Utils/logger').logger;
const PayloadConf = require('../TemplateSet');

async function ConfigureExitingEntity(body, i, EntityResult) {
    //Check if one Pricing Profile exist
    try {
        PricingProfileResult = await CATEntity.GetPricingProfile(body.Bearer, body.Entity[i].EntityID, CKOTEMPLATE);
        if (PricingProfileResult.data.total_count > 1) {
            logger.info(`NB of pricing profile: ${PricingProfileResult.data.total_count.length}`, { source: "ConfigureExitingEntity" });
            //If Pricing Profile exist and there is more than one, then list them
            finalresult.Entity[i].Pricing_Profile_ID = [];
            for (let ProcessingProfileNumber = 0; ProcessingProfileNumber < PricingProfileResult.data._embedded.pricing_profiles.length; ProcessingProfileNumber++) {
                finalresult.Entity[i].Pricing_Profile_ID.push(PricingProfileResult.data._embedded.pricing_profiles[ProcessingProfileNumber].id);
            }
        }
        else if (PricingProfileResult.data.total_count === 1) {
            logger.info(`Pricing Profile ID already exist: ${PricingProfileResult.data._embedded.pricing_profiles[0].id}`, { source: "ConfigureExitingEntity" });
            //If Pricing Profile exist and there is one, then list it
            finalresult.Entity[i].Pricing_Profile_ID = PricingProfileResult.data._embedded.pricing_profiles[0].id;
        }
        else {
            //If Pricing Profile dosen't exist, then create it
            try {
                logger.info(`Create Pricing Profile`, { source: "ConfigureExitingEntity" });
                CreatePricingProfile = await CATEntity.Create_Pricing_Profile(body.Bearer, body.Entity[i].EntityID, EntityResult.data.name, CKOTEMPLATE);
                Payload = PayloadConf.configurePricingProfile(CKOTEMPLATE, body.Entity[i].EntityName, EntityID, body.Entity[i].BusinessModel);
                logger.info(`Create Pricing Profile`, { source: "ConfigureExitingEntity" });
                GetPricingProfile = await CATEntity.Create_Pricing_Profile(body.Bearer, EntityID, Payload);
                finalresult.Entity[i].Pricing_Profile_ID = CreatePricingProfile.data.id;
            }
            catch (err) {
                logger.error(`Error while creating pricing profile: ${err}`, { source: "ConfigureExitingEntity" });
                finalresult.Entity[i].Pricing_Profile_ID = err.data;
            }
        };
    }
    catch (err) {
        logger.error(`Pricing profile NOT created : ${err}`, { source: "ConfigureExitingEntity" });
        finalresult.Entity[i].Pricing_Profile_ID = err
    }
    try {
        APMPricingProfileResult = await CATEntity.GetAPMPricingProfile(body.Bearer, body.Entity[i].EntityID);
        if (APMPricingProfileResult.data?.id) {
            //If Pricing Profile exist and there is one, then list it
            finalresult.Entity[i].APM_Pricing_Profile_ID = PricingProfileResult.data._embedded.pricing_profiles[0].id;
            logger.info(`APM Pricing Profil already exist :${PricingProfileResult.data._embedded.pricing_profiles[0].id}`, { source: "ConfigureExitingEntity" });
        }
        else {
            //If Pricing Profile dosen't exist, then create it
            logger.info(`Other error :${APMPricingProfileResult.data}`, { source: "ConfigureExitingEntity" });
        };
    } catch (err) {
        if (err?.status) {
            if (err.status === 404) {
                logger.info(`Creating APM Pricing Profile`, { source: "ConfigureExitingEntity" });
                try {
                    CreateAPMPricingProfile = await CATEntity.Create_AMP_Pricing_Profile(body.Bearer, body.Entity[i].EntityID, EntityResult.data.name, CKOTEMPLATE);
                    finalresult.Entity[i].APM_Pricing_Profile_ID = CreateAPMPricingProfile.data.id;
                    logger.info(`APM Pricing Profile created: ${CreateAPMPricingProfile.data.id}`, { source: "ConfigureExitingEntity" });
                }
                catch (err) {
                    logger.error(`APM Pricing profile NOT created: ${err}`, { source: "ConfigureExitingEntity" });
                    finalresult.Entity[i].APM_Pricing_Profile_ID = err
                }
            }
        }
    }
    //check if a default routing rules for payment exist 
    try {
        //Get routing rules list 
        RoutingPaymentRulesList = await CATEntity.GetPaymentRoutingRule(body.Bearer, body.Entity[i].EntityID);
        if (RoutingPaymentRulesList.data.total_count > 0) {
            logger.info(`Routing payment rules for ${body.Entity[i].EntityID} already exist`, { source: "ConfigureExitingEntity" });
        }
        else {
            logger.info(`Create Currency Account`, { source: "ConfigureExitingEntity" });
            CreateCurrencyAccount = await CATProcessingChannel.Create_Currency_Account(body.Bearer, body.Entity[i].EntityID, "Default_Currency_Account", CKOTEMPLATE)
            CurrencyAccountID = CreateCurrencyAccount.data.id
            logger.info(`Currency account for default Routing Payment Rule : ${CreateCurrencyAccount.data.id}`, { source: "ConfigureExitingEntity" });
            //Configure Defaut Routing payment rules

            logger.info(`Create DEFAUT routing payment rules for ${body.Entity[i].EntityID} and CurrencyAccount : ${CurrencyAccountID}`, { ClientID: body.ClientId, source: "ConfigureExitingEntity" });
            CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(body.Bearer, body.Entity[i].EntityID, CurrencyAccountID, true)
            RoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
            ConfigureProcessingChannelResult.Payment_Routing_Rules_ID = RoutingPaymentRulesID;
            waitfor.delay(delay);
        }
    }
    catch (err) {
        return { "Payment_Routing_Rules_ID": err }
    }

}

async function ConfigureNewEntity(body, i, EntityID, CKOTEMPLATE) {
    EntityConfiguration = [];
    try {
        logger.info(`Create Currency Account`, { source: "ConfigureNewEntity" });
        CreateCurrencyAccount = await CATProcessingChannel.Create_Currency_Account(body.Bearer, EntityID, "Default_Currency_Account", CKOTEMPLATE)
        CurrencyAccountID = CreateCurrencyAccount.data.id
        EntityConfiguration.CurrencyAccount = CurrencyAccountID;
        logger.info(`Currency account for default Routing Payment Rule : ${CreateCurrencyAccount.data.id}`, { source: "ConfigureNewEntity" });
        //Configure Defaut Routing payment rules
        logger.info(`Create DEFAUT routing payment rules for ${EntityID} and CurrencyAccount : ${CurrencyAccountID}`, { ClientID: body.ClientId, source: "ConfigureNewEntity" });
        CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(body.Bearer, EntityID, null, CurrencyAccountID, true)
        DefaultRoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
        EntityConfiguration.DefaultRoutingPaymentRules = DefaultRoutingPaymentRulesID;
        waitfor.delay(body.delay);
    }
    catch (err) {
        EntityConfiguration.CurrencyAccount = err;
        EntityConfiguration.DefaultRoutingPaymentRulesID = err;
        logger.error(`Error while setup of default currency account + routing payment rules : ${err}`, { source: "ConfigureNewEntity" });
    }
    //Create Pricing Profile
    try {
        Payload = PayloadConf.configurePricingProfile(CKOTEMPLATE, body.Entity[i].EntityName, EntityID, body.Entity[i].BusinessModel);
        logger.info(`Create Pricing Profile`, { source: "ConfigureNewEntity" });
        GetPricingProfile = await CATEntity.Create_Pricing_Profile(body.Bearer, EntityID, Payload);
        finalresult.Entity[i].Pricing_Profile_ID = GetPricingProfile.data.id;
        EntityConfiguration.Pricing_Profile = GetPricingProfile.data.id;
    }
    catch (err) {
        logger.error(`Pricing profile NOT created : ${err}`, { source: "ConfigureNewEntity" });
        finalresult.Entity[i].Pricing_Profile_ID = err;
        EntityConfiguration.Pricing_Profile = err;
    }
    try {
        logger.info(`Create APM Pricing Profile`, { source: "ConfigureNewEntity" });
        GetAPMPricingProfile = await CATEntity.Create_AMP_Pricing_Profile(body.Bearer, EntityID, body.Entity[i].EntityName, CKOTEMPLATE);
        logger.info(`APM Pricing profile created : ${GetAPMPricingProfile.data.id}`, { source: "ConfigureNewEntity" });
        finalresult.Entity[i].APM_Pricing_Profile_ID = GetAPMPricingProfile.data.id;
        EntityConfiguration.APM_Pricing_Profile = GetAPMPricingProfile.data.id;
    }
    catch (err) {
        logger.error(`APM Pricing  NOT created : ${err}`, { source: "ConfigureNewEntity" });
        finalresult.Entity[i].APM_Pricing_Profile_ID = err;
        EntityConfiguration.APM_Pricing_Profile = err;
    }
    return EntityConfiguration
}

module.exports = {
    ConfigureExitingEntity,
    ConfigureNewEntity
}