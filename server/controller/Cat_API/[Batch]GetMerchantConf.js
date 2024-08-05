const CATEntity = require('./[CAT]Entity_API');
const CATProcessingChannel = require('./[CAT]ProcessingChannel_API');
const logger = require('../../Utils/logger').logger;
const { parentPort, workerData } = require('worker_threads');
const ErrorHandling = require('../Error');

async function GetConf(body) {
  MerchantConfFinal = { "Entity": [] };
  try {
    GetAllEntity = await CATEntity.GetAllEntity(body.Bearer, body.ClientId, 25);
    logger.info(`"NB entity :" ${GetAllEntity.body.total_count}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
    if (GetAllEntity.body.total_count > 25) {
      logger.info(`Number of entity > 25`, { ClientID: body.ClientId, source: "GetMerchantConf" });
      NBpage = Math.ceil(GetAllEntity.body.total_count / 25);
      logger.info(`Nb of pages :" ${NBpage}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
      skip = 0;
      for (let e = 0; e < NBpage; e++) {
        logger.info(`Skip Value :" ${skip}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
        GetAllEntity = await CATEntity.GetAllEntity(body.Bearer, body.ClientId, skip);
        logger.info(`getallentity lenth: ${GetAllEntity.body._embedded.entities.length}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
        for (let i = 0; i < GetAllEntity.body._embedded.entities.length; i++) {
          logger.info(`Result = '{ EntityName: ${GetAllEntity.body._embedded.entities[i].name}, EntityID: ${GetAllEntity.body._embedded.entities[i].id}, status: ${GetAllEntity.body._embedded.entities[i].status}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
          MerchantConfFinal.Entity.push({ "EntityName": GetAllEntity.body._embedded.entities[i].name, "EntityID": GetAllEntity.body._embedded.entities[i].id, "status": GetAllEntity.body._embedded.entities[i].status });
        }
        logger.info(`Skip Value:${skip}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
        skip = skip + 25;
      }
    }
    else {
      logger.info(`Number of entity < 25`, { ClientID: body.ClientId, source: "GetMerchantConf" });
      GetAllEntity = await CATEntity.GetAllEntity(body.Bearer, body.ClientId, 0);
      for (let i = 0; i < GetAllEntity.body._embedded.entities.length; i++) {
        logger.info(`EntityName: ${GetAllEntity.body._embedded.entities[i].name} EntityID: ${GetAllEntity.body._embedded.entities[i].id} status: ${GetAllEntity.body._embedded.entities[i].status}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
        MerchantConfFinal.Entity.push({ "EntityName": GetAllEntity.body._embedded.entities[i].name, "EntityID": GetAllEntity.body._embedded.entities[i].id, "status": GetAllEntity.body._embedded.entities[i].status });
      }
    };
    if (MerchantConfFinal.Entity.length === GetAllEntity.body.total_count) {
      logger.info(`Count match go next stepf`, { ClientID: body.ClientId, source: "GetMerchantConf" });
      for (let entNumb = 0; entNumb < MerchantConfFinal.Entity.length; entNumb++) {
        try {
          MerchantConfFinal.Entity[entNumb].Processing_channel = []
          MerchantConfFinal.Entity[entNumb].Currency_Account = []
          proccessingchannel_list = await CATProcessingChannel.GetAllProcessingChannels(body.Bearer, MerchantConfFinal.Entity[entNumb].EntityID);
          for (let PCNumb = 0; PCNumb < proccessingchannel_list.data._embedded.processing_channels.length; PCNumb++) {
            logger.info(`Entity: ${MerchantConfFinal.Entity[entNumb].EntityName} (${MerchantConfFinal.Entity[entNumb].EntityID}), processing channel : ${proccessingchannel_list.data._embedded.processing_channels[PCNumb].name} (${proccessingchannel_list.data._embedded.processing_channels[PCNumb].id})`, { ClientID: body.ClientId, source: "GetMerchantConf" });
            MerchantConfFinal.Entity[entNumb].Processing_channel.push({ "ProcessingChannelName": proccessingchannel_list.data._embedded.processing_channels[PCNumb].name, "ProcessingChannelID": proccessingchannel_list.data._embedded.processing_channels[PCNumb].id, "business_model": proccessingchannel_list.data._embedded.processing_channels[PCNumb].business_model });
            MerchantConfFinal.Entity[entNumb].Processing_channel[PCNumb].PaymentMethod = [];
            try {
              ProcessingChannelConf = await CATProcessingChannel.GetProcessingChannelConf(body.Bearer, body.ClientId, null, proccessingchannel_list.data._embedded.processing_channels[PCNumb].id);
              for (let ProcessorNumb = 0; ProcessorNumb < ProcessingChannelConf.data.processors.length; ProcessorNumb++) {
                MerchantConfFinal.Entity[entNumb].Processing_channel[PCNumb].PaymentMethod.push(ProcessingChannelConf.data.processors[ProcessorNumb].scheme);
                //Force activation of dynamic billing descriptor
                /*ProcessorGatewayConf = await CATProcessingChannel.Get_Gateway_Processor_Details(body.Bearer, proccessingchannel_list.data._embedded.processing_channels[PCNumb].id,ProcessingChannelConf.data.processors[ProcessorNumb].id);
                if(ProcessorGatewayConf.data.billing_information.has_dynamic_descriptor === false){
                  MerchantConfFinal.processorlist.push(ProcessingChannelConf.data.processors[ProcessorNumb].id);
                  ProcessorGatewayConf.data.billing_information.has_dynamic_descriptor = true;
                  await CATProcessingChannel.Update_Gateway_Processor(body.Bearer, proccessingchannel_list.data._embedded.processing_channels[PCNumb].id,ProcessingChannelConf.data.processors[ProcessorNumb].id,ProcessorGatewayConf.data);
                }*/
              }
            }
            catch (err) {
              MerchantConfFinal.Entity[entNumb].Processing_channel[PCNumb].PaymentMethod.push(ErrorHandling.ErrorHandling(err, "GetConf_GetProcessingChannelConf"));
            }
          }
          //Get Currency Account List
          try {
            CurrencyAccountList = await CATEntity.GetCurrencyAccountList(body.Bearer, MerchantConfFinal.Entity[entNumb].EntityID);
            for (let NBCA = 0; NBCA < CurrencyAccountList.data._embedded.currency_accounts.length; NBCA++) {
              MerchantConfFinal.Entity[entNumb].Currency_Account.push({ "Name": CurrencyAccountList.data._embedded.currency_accounts[NBCA].name, "ID": CurrencyAccountList.data._embedded.currency_accounts[NBCA].id })
            }
          }
          catch (err) {
            logger.error(`Error while get the list of Currency Account :" ${err}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
            MerchantConfFinal.Entity[entNumb].Currency_Account = ErrorHandling.ErrorHandling(err, "GetConf_GetCurrencyAccountList")
          }
        }
        catch (err) {
          logger.error(`Error :" ${err}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
          finalresult = { "status": 500, "Message": err }
        }
      };
    }
    else {
      logger.error(`Count mismatch ERROR`, { ClientID: body.ClientId, source: "GetMerchantConf" });
      logger.error(`Result count = ${MerchantConfFinal.Entity.length}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
      logger.error(`Initial count = ${GetAllEntity.body.total_count}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
      throw `Count mismatch ERROR`
    }
    MerchantConfFinal['status'] = 200;
    MerchantConfFinal['result'] = "merchant found";
    return MerchantConfFinal;
  }
  catch (err) {
    logger.error(`Error :" ${err}`, { ClientID: body.ClientId, source: "GetMerchantConf" });
    return ErrorHandling.ErrorHandling(err, "GetConf")
  }
};

parentPort.once('message', async (message) => {
  DecodedJWT = message.DecodedJWT;
  CorrelationID = message.CorrelationID;
  if (message.ENV === "Prod") {
    baseURL = 'https://client-admin.cko-prod.ckotech.co/';
    hostURL = baseURL.replace('https://', '').replace('/', '');
    CATENV = "Production";
  }
  else {
    baseURL = 'https://client-admin.cko-sbox.ckotech.co/';
    hostURL = baseURL.replace('https://', '').replace('/', '');
    CATENV = "Sandbox"
  }
  GetConfResut = await GetConf(message.body);
  parentPort.postMessage(GetConfResut);
});
module.exports = {
  GetConf
}
