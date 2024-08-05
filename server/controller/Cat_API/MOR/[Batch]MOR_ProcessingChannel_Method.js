const CatConfigInt = require('../../Cat_API/[Batch]PaymentMethod_Configuration');
const CATProcessingChannel = require('../../Cat_API/[CAT]ProcessingChannel_API');
const logger = require('../../../Utils/logger').logger;
const PayloadConf = require('../../TemplateSet');
const MoR_CONF = require('../../Cat_API/CAT_Request_Template/MoR_CONF.json');

async function ConfCreateProcessingChannel(Bearer, ClientId, EntityID, ProcessingChannelName, VaultID) {
    ProcessingChannelMatrix = {};
    logger.info(`Creating processing channel :${ProcessingChannelName}`, { source: "ConfCreateProcessingChannel" });
    try {
        //Configure Processing Channel
        //Create Payload
        Payload = await PayloadConf.configureProcessingChannel(ProcessingChannelName, ClientId, EntityID, VaultID, MoR_CONF.ProcessingChannel);
        //Create Processing channel
        ProcessingChannelResult = await CATProcessingChannel.CreateProcessingChannel(Bearer, EntityID, Payload);
        ProcessingChannelID = ProcessingChannelResult.data.id
        //Push the result in the array
        logger.info(`Processing channel ID Created : ${ProcessingChannelID}`, { source: "ConfCreateProcessingChannel" });
        //Configure Authentication Processing Channel
        try {
            //Create Payload
            Payload = await PayloadConf.configureAuthenticationProcessingChannel(ProcessingChannelID, VaultID);
            CreateSessionProcessingChannelResult = await CATProcessingChannel.Create_Session_Processing_Channels(Bearer, EntityID, Payload);
            logger.info(`Session Processing Channel created : ${ProcessingChannelID}`, { source: "ConfCreateProcessingChannel" });
            ProcessingChannelMatrix = ({ Processing_Channel_Name: ProcessingChannelName, Processing_Channel_Id: ProcessingChannelID, "Session_Processing_Channel_ID": ProcessingChannelID })
            //return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": ProcessingChannelID }
        }
        catch (err) {
            try {
                console.log("RETRY")
                console.log("Wait for 20000 MS")
                await waitfor.delay(20000);
                CreateSessionProcessingChannelResult = await CATProcessingChannel.Create_Session_Processing_Channels(Bearer, EntityID, Payload);
                console.log("Session Processing Channel created :", ProcessingChannelID)
                logger.info(`Session Processing Channel created : ${ProcessingChannelID}`, { source: "ConfCreateProcessingChannel" });
                ProcessingChannelMatrix = ({ Processing_Channel_Name: ProcessingChannelName, Processing_Channel_Id: ProcessingChannelID, "Session_Processing_Channel_ID": ProcessingChannelID })
                //return { "Processing_Channel_ID": ProcessingChannelID, "Session_Processing_Channel_ID": ProcessingChannelID }
            }
            catch {
                logger.error(`Error while creating Session Processing channel: ${err}`, { source: "ConfCreateProcessingChannel" });
                ProcessingChannelMatrix = ({ Processing_Channel_Name: ProcessingChannelName, Processing_Channel_Id: ProcessingChannelID, "Session_Processing_Channel_ID": err })
            }
        }
    }
    catch (err) {
        logger.error(`Error while creating processing channel ${err}`, { source: "ConfCreateProcessingChannel" });
        ProcessingChannelMatrix = ({ Processing_Channel_Name: ProcessingChannelName, Processing_Channel_Id: err, "Session_Processing_Channel_ID": null })
    }
    return ProcessingChannelMatrix
}
module.exports = {
    ConfCreateProcessingChannel
}