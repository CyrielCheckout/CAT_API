const CATEntity = require('./[CAT]Entity_API');
const CATProcessingChannel = require('./[CAT]ProcessingChannel_API');
const waitfor = require('../IdempotencyKey');
const CatConfigInt = require('./[Batch]PaymentMethod_Configuration');
const CatConfSetup = require('./[Batch]Entity_Setup')
const CatPaymentMethodConfig = require('./[Batch]PaymentMethod_Method');
const CKOSASTEMPLATE = require('../../ConfTemplates/CKOSAS.json');
const CKOLTDTEMPLATE = require('../../ConfTemplates/CKOLTD.json');
const CatMoRProcessingChannelMethodConfig = require('../Cat_API/MOR/[Batch]MOR_ProcessingChannel_Method');
const logger = require('../../Utils/logger').logger;
const PayloadConf = require('../TemplateSet');
const ErrorHandling = require('../Error');

async function NewEntity(body, i, VaultID) {
    Payload = PayloadConf.configureEntityPayload(body.Entity[i].LegalEntity, body.Entity[i].EntityName, false, null);
    logger.info(`Creating entity :${body.Entity[i].EntityName} with legal entity :${body.Entity[i].LegalEntity}`, { source: "NewEntity" });
    try {
        EntityResult = await CATEntity.CreateEntity(body.Bearer, body.ClientId, Payload);
        waitfor.delay(body.delay);
        logger.info(`Entity creation status: ${EntityResult.status}`, { source: "NewEntity" });
        EntityID = EntityResult.data.id;
        finalresult.Entity.push({ "Entity_Name": body.Entity[i].EntityName, "EntityID": EntityID, "status": EntityResult.status });
        logger.info(`Entity : ${body.Entity[i].EntityName} was successfully created with the ID : ${EntityID}`, { source: "NewEntity" });
        //
        //SetupEntity
        //
        await CatConfSetup.ConfigureNewEntity(body, i, EntityID, CKOTEMPLATE);
        //SetupProcessingProfiles
        allpmrequired = [];
        for (allpm = 0; allpm < body.Entity[i].Processing_channel.length; allpm++) {
            for (allpm2 = 0; allpm2 < body.Entity[i].Processing_channel[allpm].PaymentMethod.length; allpm2++) {
                if (allpmrequired.includes(body.Entity[i].Processing_channel[allpm].PaymentMethod[allpm2])) {
                }
                else {
                    allpmrequired.push(body.Entity[i].Processing_channel[allpm].PaymentMethod[allpm2]);
                }
            }
        };
        ProcessingProfilesConfResult = await CatPaymentMethodConfig.ConfProcessingProfile(body.Bearer, body.Entity[i].LegalEntity, allpmrequired, EntityID, body.Entity[i].EntityName, null, "0742")
        finalresult.Entity[i].Processing_Channel = []
        PROCESSINGCHANNELCONF = [];
        for (let ProcessingChannelNumber = 0; ProcessingChannelNumber < body.Entity[i].Processing_channel.length; ProcessingChannelNumber++) {
            logger.info(`Creating processing channel :${body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName} with legal entity :${body.Entity[i].LegalEntity}`, { source: "NewEntity" });
            //Create processing channel
            try {
                PROCESSINGCHANNELCONF.push(await CatMoRProcessingChannelMethodConfig.ConfCreateProcessingChannel(body.Bearer, body.ClientId, EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName, VaultID));
                finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": PROCESSINGCHANNELCONF[ProcessingChannelNumber].Processing_Channel_Id, "Processing_Channel_Name": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName };
                try {
                    // configure processing channel
                    ConfigureProcessingChannelFunc = await CatConfigInt.ConfigureProcessingChannel(body.Bearer, EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName, body.delay, CKOTEMPLATE, i, ProcessingChannelNumber);
                    //Configure Payment Method

                    PaymentMethodConfResult = await CatPaymentMethodConfig.ConfPaymentMethod(body.Bearer, body.Entity[i].Processing_channel[ProcessingChannelNumber].PaymentMethod, EntityID, PROCESSINGCHANNELCONF[ProcessingChannelNumber].Processing_Channel_Id, body.Entity[i].EntityName,body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName,ProcessingProfilesConfResult, body.Entity[i].LegalEntity, body.Entity[i].Processing_channel[ProcessingChannelNumber].PaymentMethodSpecificConf,i, ProcessingChannelNumber);
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].Payment_Method = PaymentMethodConfResult;
                }
                catch (err) {
                    logger.error(`ERROR while configuring the processing channel :${err} `, { source: "NewEntity" });
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": "Created but not configured", "Processing_Channel_Name": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName, "status": err };
                }
            }
            catch (err) {
                logger.error(`ERROR while creating processing channel :${err}`, { source: "NewEntity" });
                finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": "ERROR", "Processing_Channel_Name": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName, "status": err };
            }
        }
    }
    catch (err) {
        finalresult.Entity.push({ "Entity_Name": body.Entity[i].EntityName, "EntityID": "ERROR", "status": err });
    }

}
async function ExistingEntity(body, i, VaultID) {
    logger.info(`Entity already created: ${body.Entity[i].EntityID}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
    try {
        EntityResult = await CATEntity.GetEntityData(body.Bearer, body.Entity[i].EntityID);
        logger.info(`CKO legal entity :${EntityResult.data.cko_legal_entity}`, { source: "ExistingEntity" });
        //get the entity data
        finalresult.Entity.push({ "Entity_Name": EntityResult.data.name, "EntityID": EntityResult.data.id, "status": EntityResult.data.status });
        //set the template for other creations
        if (EntityResult.data.cko_legal_entity === "cko-sas") {
            CKOTEMPLATE = CKOSASTEMPLATE;
        }
        else if (EntityResult.data.cko_legal_entity === "cko-ltd-uk") {
            CKOTEMPLATE = CKOLTDTEMPLATE;
        }

        await CatConfSetup.ConfigureExitingEntity(body, i, EntityResult, CKOTEMPLATE)
        //Processing Channel configuration 
        finalresult.Entity[i].Processing_Channel = []
        //SetupProcessingProfiles
        allpmrequired = [];
        for (allpm = 0; allpm < body.Entity[i].Processing_channel.length; allpm++) {
            for (allpm2 = 0; allpm2 < body.Entity[i].Processing_channel[allpm].PaymentMethod.length; allpm2++) {
                if (allpmrequired.includes(body.Entity[i].Processing_channel[allpm].PaymentMethod[allpm2])) {
                }
                else {
                    allpmrequired.push(body.Entity[i].Processing_channel[allpm].PaymentMethod[allpm2]);
                }
            }
        };
        ProcessingProfilesConfResult = await CatPaymentMethodConfig.ConfProcessingProfile(body.Bearer, EntityResult.data.cko_legal_entity, allpmrequired, body.Entity[i].EntityID, EntityResult.data.name, null, "0742")
        for (let ProcessingChannelNumber = 0; ProcessingChannelNumber < body.Entity[i].Processing_channel.length; ProcessingChannelNumber++) {
            if (body.Entity[i]?.Processing_channel[ProcessingChannelNumber]?.ProcessingChannelID?.length > 0) {
                //If processing channel exist, then get data
                logger.info(`Processing Channel already created :${body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID}`, { source: "ExistingEntity" });
                try {
                    GetProcessingChannelData = await CATProcessingChannel.GetProcessingChannelConf(body.Bearer, body.ClientId, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID);
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID, "Processing_Channel_Name": GetProcessingChannelData.data.name };
                    //Check if Session Processing Channel Exist
                    try {
                        SessionProcessingChannel = await CATProcessingChannel.Get_Processing_channel_Session(body.Bearer, body.Entity[i].EntityID);
                        for (let SProcessingChannelNumber = 0; SProcessingChannelNumber < SessionProcessingChannel.data.available_gateway_processing_channels.length; SProcessingChannelNumber++) {
                            if (SessionProcessingChannel.data.available_gateway_processing_channels[SProcessingChannelNumber].value === body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID) {
                                //If not, create it 
                                try {
                                    logger.info(`Create Session Processing Channel `, { source: "ExistingEntity" });
                                    SESSIONPRocessingChannelCreat = await CATProcessingChannel.Create_Session_Processing_Channels(body.Bearer, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID, VaultID);
                                }
                                catch (err) {
                                    logger.error(`ERROR whlite creating Session processing channel : ${err}`, { source: "ExistingEntity" });
                                }
                            }
                        }
                    }
                    catch (err) {
                        logger.error(`ERROR while get processing channel session : ${err}`, { source: "ExistingEntity" });
                    }
                }
                catch (err) {
                    logger.error(`ERROR while get processing channel : ${err}`, { source: "ExistingEntity_GetProcessingChannelConf" });
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": ErrorHandling.ErrorHandling(err, "ExistingEntity_GetProcessingChannelConf") };
                }
                //Configure Payment Method
                logger.info(`Configure payment method for already existing Processing channel`, { source: "ExistingEntity" });
                PaymentMethodConfResult = await CatPaymentMethodConfig.ConfPaymentMethod(body.Bearer, body.Entity[i].Processing_channel[ProcessingChannelNumber].PaymentMethod, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID,EntityResult.data.name, GetProcessingChannelData.data.name, ProcessingProfilesConfResult,EntityResult.data.cko_legal_entity, body.Entity[i].Processing_channel[ProcessingChannelNumber].PaymentMethodSpecificConf, i, ProcessingChannelNumber);
                finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].Payment_Method = PaymentMethodConfResult;
            }
            else {
                //If not, then Create Processing channel
                logger.info(`Creating processing channel :${body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName}`, { source: "ExistingEntity_CreateProcessingChannel" });
                //create processing channel
                try {
                    PROCESSINGCHANNELCONF = await CatMoRProcessingChannelMethodConfig.ConfCreateProcessingChannel(body.Bearer, body.ClientId, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName, VaultID);
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": ProcessingChannelID, "Processing_Channel_Name": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName };
                    // configure processing channel
                    ConfigureProcessingChannelFunc = await CatConfigInt.ConfigureProcessingChannel(body.Bearer, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName, body.delay, CKOTEMPLATE, i, ProcessingChannelNumber);
                    //Configure Payment Method
                    PaymentMethodConfResult = await CatPaymentMethodConfig.ConfPaymentMethod(body.Bearer, body.Entity[i].Processing_channel[ProcessingChannelNumber].PaymentMethod, body.Entity[i].EntityID, ProcessingChannelID,EntityResult.data.name, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName, ProcessingProfilesConfResult,EntityResult.data.cko_legal_entity,body.Entity[i].Processing_channel[ProcessingChannelNumber].PaymentMethodSpecificConf);
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber].Payment_Method = PaymentMethodConfResult;
                }
                catch (err) {
                    logger.error(`Error while creating the processing channel :${err}`, { source: "ExistingEntity_CreateProcessingChannel" });
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": ErrorHandling.ErrorHandling(err, "ExistingEntity_CreateProcessingChannel") };
                }
            }
        }
    } catch (err) {
        finalresult.Entity.push({ "Entity_Name": body.Entity[i].EntityName, "EntityID": body.Entity[i].EntityID, "status": ErrorHandling.ErrorHandling(err, "ExistingEntity") });
    }
}

module.exports = {
    NewEntity,
    ExistingEntity
}