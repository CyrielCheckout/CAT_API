const CATEntity = require('./CAT.EntityConf');
const CATProcessingChannel = require('./CAT.ProcessingChannelConf');
const waitfor = require('../IdempotencyKey');
const loggerInfo = require('../../Utils/logger').loggerInfo;
const loggerError = require('../../Utils/logger').loggerError;
async function GetConf(body) {
  MerchantConfFinal = { "Entity": [] };
  //MerchantConfFinal.processorlist = []
  try {
    GetAllEntity = await CATEntity.GetAllEntity(body.Bearer, body.ClientId, 25);
    console.log("NB entity :", GetAllEntity.body.total_count);
    if (GetAllEntity.body.total_count > 25) {
      loggerInfo.log( 'info','GetMerchantConf for '+body.ClientId+', Number of entity > 25' ,"CAT_API");
      NBpage = Math.ceil(GetAllEntity.body.total_count / 25);
      console.log("Nb of pages :", NBpage);
      skip = 0;
      for (let e = 0; e < NBpage; e++) {
        console.log("Skip Value :", skip);
        GetAllEntity = await CATEntity.GetAllEntity(body.Bearer, body.ClientId, skip);
        console.log("getallentity lenth:", GetAllEntity.body._embedded.entities.length)
        for (let i = 0; i < GetAllEntity.body._embedded.entities.length; i++) {
          loggerInfo.log( 'info','GetMerchantConf for '+body.ClientId+', Result = '+{ "EntityName": GetAllEntity.body._embedded.entities[i].name, "EntityID": GetAllEntity.body._embedded.entities[i].id, "status": GetAllEntity.body._embedded.entities[i].status } ,"CAT_API");
          MerchantConfFinal.Entity.push({ "EntityName": GetAllEntity.body._embedded.entities[i].name, "EntityID": GetAllEntity.body._embedded.entities[i].id, "status": GetAllEntity.body._embedded.entities[i].status });
        }
        loggerInfo.log( 'info','GetMerchantConf for '+body.ClientId+', Skip Value :'+skip,"CAT_API");
        skip = skip + 25;
      }
    }
    else {
      loggerInfo.log( 'info','GetMerchantConf for '+body.ClientId+', Number of entity < 25' ,"CAT_API");
      GetAllEntity = await CATEntity.GetAllEntity(body.Bearer, body.ClientId, 0);
      for (let i = 0; i < GetAllEntity.body._embedded.entities.length; i++) {
        console.log({ "EntityName": GetAllEntity.body._embedded.entities[i].name, "EntityID": GetAllEntity.body._embedded.entities[i].id, "status": GetAllEntity.body._embedded.entities[i].status })

        MerchantConfFinal.Entity.push({ "EntityName": GetAllEntity.body._embedded.entities[i].name, "EntityID": GetAllEntity.body._embedded.entities[i].id, "status": GetAllEntity.body._embedded.entities[i].status });
      }
    };
    if (MerchantConfFinal.Entity.length === GetAllEntity.body.total_count) {
      loggerInfo.log( 'info','GetMerchantConf for '+body.ClientId+', Count match go next step' ,"CAT_API");
      for (let entNumb = 0; entNumb < MerchantConfFinal.Entity.length; entNumb++) {
        try {
          MerchantConfFinal.Entity[entNumb].Processing_channel = []
          MerchantConfFinal.Entity[entNumb].Currency_Account = []
          proccessingchannel_list = await CATProcessingChannel.GetAllProcessingChannels(body.Bearer, MerchantConfFinal.Entity[entNumb].EntityID);
          for (let PCNumb = 0; PCNumb < proccessingchannel_list.data._embedded.processing_channels.length; PCNumb++) {
            loggerInfo.log (`info`,`GetMerchantConf for ${body.ClientId}, Entity :${ MerchantConfFinal.Entity[entNumb].EntityName} (${MerchantConfFinal.Entity[entNumb].EntityID}), processing channel : ${proccessingchannel_list.data._embedded.processing_channels[PCNumb].name} (${proccessingchannel_list.data._embedded.processing_channels[PCNumb].id}) ` ,`CAT_API`);
            MerchantConfFinal.Entity[entNumb].Processing_channel.push({ "ProcessingChannelName": proccessingchannel_list.data._embedded.processing_channels[PCNumb].name, "ProcessingChannelID": proccessingchannel_list.data._embedded.processing_channels[PCNumb].id, "business_model": proccessingchannel_list.data._embedded.processing_channels[PCNumb].business_model });
            MerchantConfFinal.Entity[entNumb].Processing_channel[PCNumb].PaymentMethod = [];
            try {
              ProcessingChannelConf = await CATProcessingChannel.GetProcessingChannelConf(body.Bearer, proccessingchannel_list.data._embedded.processing_channels[PCNumb].id);
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
              MerchantConfFinal.Entity[entNumb].Processing_channel[PCNumb].PaymentMethod.push(err);
            }
          }
          //Get Currency Account List
          try {
            CurrencyAccountList = await CATEntity.GetCurrencyAccountList(body.Bearer, MerchantConfFinal.Entity[entNumb].EntityID);
            for (let NBCA = 0; NBCA < CurrencyAccountList.data._embedded.currency_accounts.length; NBCA++) {
              MerchantConfFinal.Entity[entNumb].Currency_Account.push({"Name": CurrencyAccountList.data._embedded.currency_accounts[NBCA].name, "ID": CurrencyAccountList.data._embedded.currency_accounts[NBCA].id })
            }
          }
          catch (err) {
            console.log(err)
            MerchantConfFinal.Entity[entNumb].Currency_Account = "Error while get the list of Currency Account"
          }
        }
        catch (err) {
          console.log(err)
          finalresult = { "status": 500, "Message": err }
        }
      };
    }
    else {
      loggerInfo.log (`info`,`GetMerchantConf for ${body.ClientId}, Count mismatch ERROR` ,`CAT_API`);
      loggerInfo.log( 'info',`GetMerchantConf for ${body.ClientId}, Result count = ${MerchantConfFinal.Entity.length}` ,"CAT_API");
      loggerInfo.log( 'info',`GetMerchantConf for ${body.ClientId}, Initial count =${GetAllEntity.body.total_count}`,"CAT_API");
    }
    MerchantConfFinal['status'] = 200;
    MerchantConfFinal['result'] = "merchant found";
    return MerchantConfFinal;
  }
  catch (err) {
    console.log(err)
    return err
  }
}
module.exports = {
  GetConf
}