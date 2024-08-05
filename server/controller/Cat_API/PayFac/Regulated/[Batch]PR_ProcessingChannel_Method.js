const CatConfigInt = require('../../[Batch]PaymentMethod_Configuration');
const CATProcessingChannel = require('../../[CAT]ProcessingChannel_API');
const logger = require('../../../../Utils/logger').logger;
const PayloadConf = require('../../../TemplateSet');
const Payfac_Regulated_CONF = require('../../CAT_Request_Template/Payfac_Regulated_CONF.json');

async function ConfCreateProcessingChannel(Bearer, CKOLEGALENTITY, ClientId, EntityID, EntityName, MCC, VaultID) {
    ProcessingChannelMatrix = [];
    for (let ProcessingChannelNumber = 0; ProcessingChannelNumber < MCC.length; ProcessingChannelNumber++) {
        logger.info(`Creating processing channel :${EntityName}_${MCC[ProcessingChannelNumber]} with legal entity :${CKOLEGALENTITY}`, { source: "ConfCreateProcessingChannel_PR" });
        try {
            //Configure Processing Channel
            //Create Payload
            Payload = await PayloadConf.configureProcessingChannel(`${EntityName}_${MCC[ProcessingChannelNumber]}`, ClientId, EntityID, VaultID, Payfac_Regulated_CONF.ProcessingChannel);
            //Create Processing channel
            ProcessingChannelResult = await CATProcessingChannel.CreateProcessingChannel(Bearer, EntityID, Payload);
            ProcessingChannelID = ProcessingChannelResult.data.id
            //Push the result in the array
            ProcessingChannelMatrix.push({ MCC: MCC[ProcessingChannelNumber], Processing_Channel_Name: `${EntityName}_${MCC[ProcessingChannelNumber]}`, Processing_Channel_Id: ProcessingChannelID });
            logger.info(`Processing channel ID Created : ${ProcessingChannelID}`, { source: "ConfCreateProcessingChannel_PR" });
            //Configure Authentication Processing Channel
            try {
                //Create Payload
                Payload = await PayloadConf.configureAuthenticationProcessingChannel(ProcessingChannelID, VaultID);
                CreateSessionProcessingChannelResult = await CATProcessingChannel.Create_Session_Processing_Channels(Bearer, EntityID, Payload);
                logger.info(`Session Processing Channel created : ${ProcessingChannelID}`, { source: "ConfCreateProcessingChannel_PR" });
                //return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": ProcessingChannelID }
            }
            catch (err) {
                try {
                    console.log("RETRY")
                    console.log("Wait for 20000 MS")
                    await waitfor.delay(20000);
                    CreateSessionProcessingChannelResult = await CATProcessingChannel.Create_Session_Processing_Channels(Bearer, EntityID, Payload);
                    console.log("Session Processing Channel created :", ProcessingChannelID)
                    logger.info(`Session Processing Channel created : ${ProcessingChannelID}`, { source: "ConfCreateProcessingChannel_PR" });
                    //return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": ProcessingChannelID }
                }
                catch {
                    logger.error(`Error while creating Session Processing channel: ${err}`, { source: "ConfCreateProcessingChannel_PR" });
                    return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": err }
                }
            }
        }
        catch (err) {
            logger.error(`Error while creating processing channel ${err}`, { source: "ConfCreateProcessingChannel_PR" });
            return { "Processing_Channel_ID": err, "Session_Processing_Channel_ID": err }
        }
    }
    return ProcessingChannelMatrix
}

module.exports = {
    ConfCreateProcessingChannel
}