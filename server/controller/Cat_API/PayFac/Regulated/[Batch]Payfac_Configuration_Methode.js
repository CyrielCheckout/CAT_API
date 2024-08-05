const CATEntity = require('../../[CAT]Entity_API');
const CATProcessingChannel = require('../../[CAT]ProcessingChannel_API');
const waitfor = require('../../../IdempotencyKey');
const CatConfigInt = require('../../[Batch]PaymentMethod_Configuration');
const CatConfSetup = require('../../[Batch]Entity_Setup')
const CatPRPaymentMethodConfig = require('./[Batch]PR_PaymentMethod_Method');
const CatPRProcessingChannelMethodConfig = require('./[Batch]PR_ProcessingChannel_Method');
const Payfac_Regulated_CONF = require('../../CAT_Request_Template/Payfac_Regulated_CONF.json');
const PayloadConf = require('../../../TemplateSet');
const logger = require('../../../../Utils/logger').logger;
const ErrorHandling = require('../../../Error');

async function NewPayfacRegulatedEntity(body, i, VaultID) {
    PayloadEntity = PayloadConf.configureEntityPayload(body.Entity[i].LegalEntity, body.Entity[i].EntityName, true, Payfac_Regulated_CONF.sub_entities_profile);
    PayloadEntity.sub_entities_profile.processing_scope.countries = body.Entity[i].countries || ["FRA"];
    PayloadEntity.sub_entities_profile.processing_scope.merchant_category_codes = body.Entity[i].merchant_category_codes || ["0742"];
    logger.info(`Creating Payfac Regulated entity :${body.Entity[i].EntityName} with legal entity :${body.Entity[i].LegalEntity}`, { source: "NewPayfacRegulatedEntity" });
    try {
        EntityResult = await CATEntity.CreateEntity(body.Bearer, body.ClientId, PayloadEntity);
        waitfor.delay(body.delay);
        logger.info(`Entity creation status: ${EntityResult.status}`, { source: "NewPayfacRegulatedEntity" });
        EntityID = EntityResult.data.id;
        finalresult.Entity.push({ "Entity_Name": body.Entity[i].EntityName, "EntityID": EntityID, "status": EntityResult.status });
        logger.info(`Entity : ${body.Entity[i].EntityName} was successfully created with the ID : ${EntityID}`, { source: "NewPayfacRegulatedEntity" });
        //
        //SetupEntity
        //
        EntityConfiguration = await CatConfSetup.ConfigureNewEntity(body, i, EntityID, CKOTEMPLATE)
        try {
            //Configure Payout Schedule
            logger.info(`Create Payout Schedule for ${EntityID} and CurrencyAccount : ${EntityConfiguration.CurrencyAccount}`, { source: "NewPayfacRegulatedEntity" });
            CreatePayoutSchedule = await CATProcessingChannel.Create_Payout_Schedules(body.Bearer, EntityID, body.Entity[i].EntityName, EntityConfiguration.CurrencyAccount, CKOTEMPLATE)
            PayoutScheduleID = CreatePayoutSchedule.data.id
            finalresult.Entity[i].PayoutScheduleSetup = { "PAYOUT_SCHEDULE": "CONFIGURED", "Payout_Schedule_ID": PayoutScheduleID };
            waitfor.delay(body.delay);
        }
        catch (err) {
            finalresult.Entity[i].PayoutScheduleSetup = { "PAYOUT_SCHEDULE": "NOT CONFIGURED", "Error": err };
        }
        //SetupProcessingProfiles
        ProcessingProfilesConfResult = await CatPRPaymentMethodConfig.ConfProcessingProfile(body.Bearer, body.Entity[i].LegalEntity, body.Entity[i].PaymentMethod, EntityID, body.Entity[i].EntityName, PayloadEntity.sub_entities_profile.processing_scope.countries, body.Entity[i].merchant_category_codes || ["0742"])
        //Creating processing channel
        ProcessingchannelMatrix = await CatPRProcessingChannelMethodConfig.ConfCreateProcessingChannel(body.Bearer, body.Entity[i].LegalEntity, body.ClientId, EntityID, body.Entity[i].EntityName, body.Entity[i].merchant_category_codes || ["0742"], VaultID)
        ProcessingchannelMatrix = await CatPRPaymentMethodConfig.ConfPaymentMethod(body.Bearer,ProcessingchannelMatrix, body.Entity[i].LegalEntity, body.Entity[i].PaymentMethod, EntityID, body.Entity[i].EntityName, ProcessingProfilesConfResult,body.Entity[i].PayfacPrefix, body.Entity[i].merchant_category_codes || ["0742"]);
        finalresult.Entity[i].Processing_Channel = ProcessingchannelMatrix;
    }
    catch (err) {
        finalresult.Entity.push({ "Entity_Name": body.Entity[i].EntityName, "EntityID": "ERROR", "status": err });
    }

}


module.exports = {
    NewPayfacRegulatedEntity
}