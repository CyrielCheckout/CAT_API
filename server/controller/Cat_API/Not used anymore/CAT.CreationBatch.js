const CATEntity = require('../CAT.EntityConf');
const CATProcessingChannel = require('../CAT.ProcessingChannelConf');
const waitfor = require('../../IdempotencyKey');

async function Createconf(body) {
  console.log("Entity to create :", body.Entity.length)
  finalresult = { "Entity": [] };
  for (let i = 0; i < body.Entity.length; i++) {
    //Create Entity
    console.log("Creating entity :", body.Entity[i].EntityName)
    try {
      EntityResult = await CATEntity.CreateEntity(body.Bearer, body.ClientId, body.Entity[i].EntityName);
      waitfor.delay(body.delay);
      console.log("Entity creation status:", EntityResult.status);
      EntityID = EntityResult.data.id;
      finalresult.Entity.push({ "Entity_Name": body.Entity[i].EntityName, "EntityID": EntityID, "status": EntityResult.status });
      console.log("Creating entity :", body.Entity[i].EntityName, " successfully created with the ID :", EntityID);
      //GetVaultID
      console.log("Get Vault ID");
      GetVaultId = await CATEntity.GetEntityDetails(body.Bearer, EntityID);
      VaultID = GetVaultId.data.services[1].key;
      finalresult.Entity[i]['VaultID'] = VaultID;
      waitfor.delay(body.delay);
      console.log("Vault ID", VaultID);
      //Create Pricing Profile
      try {
        console.log("Create Pricing Profile")
        GetPricingProfile = await CATEntity.Create_Pricing_Profile(body.Entity[i].EntityLegalEntity,body.Bearer, EntityID, body.Entity[i].EntityName);
        finalresult.Entity[i].Pricing_Profile_ID = GetPricingProfile.data.id;
      }
      catch (err) {
        finalresult.Entity[i].Pricing_Profile_ID = err.data;
      }
      console.log("Number of processing channels for the entity", EntityID, " :", body.Entity[i].Processing_channel.length);
      finalresult.Entity[i].Processing_Channel = []
      for (let e = 0; e < body.Entity[i].Processing_channel.length; e++) {
        try {
          ProcessingChannelResult = await CATProcessingChannel.CreateProcessingChannel(body.Bearer, body.ClientId, EntityID, body.Entity[i].Processing_channel[e].ProcessingChannelName, VaultID)
          ProcessingChannelID = ProcessingChannelResult.data.id;
          finalresult.Entity[i].Processing_Channel.push({ "Processing_Channel_ID": ProcessingChannelID, "Processing_Channel_Name": body.Entity[i].Processing_channel[e].ProcessingChannelName });
          waitfor.delay(body.delay);

          //Create Session processing channel
          console.log("Create processing channel for Session")
          try {
            CreateSessionProcessingChannel = await CATProcessingChannel.Create_Session_Processing_Channels(body.Bearer, EntityID, ProcessingChannelID, VaultID);
            console.log("Create Session processing channel ")
            finalresult.Entity[i].Processing_Channel[e].Session_Processing_Channel = CreateSessionProcessingChannel.data.id;
            waitfor.delay(body.delay);
          }
          catch (err) {
            console.log(err)
            return err
          }
          //Configure Visa
          if (body.Entity[i].Processing_channel[e].PaymentMethod.includes('VISA')) {
            console.log("Create VISA")
            try {
              //Create Manual processor
              console.log("Manual processor VISA")
              CreateProcessingProfile = await CATProcessingChannel.Create_Manual_processor_Visa(body.Bearer, ProcessingChannelID, body.Entity[i].Processing_channel[e].ProcessingChannelName)
              PPVisa = CreateProcessingProfile.data.id
              finalresult.Entity[i].Processing_Channel[e].VISASetup = { "VISA": "CONFIGURED", "Processing_Profile_ID": PPVisa };
              waitfor.delay(body.delay);
              try {
                //Create Session processor Profile
                console.log("Create Session processor VISA")
                CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Visa(body.Bearer, ProcessingChannelID, body.Entity[i].Processing_channel[e].ProcessingChannelName, PPVisa);
                finalresult.Entity[i].Processing_Channel[e].VISASetup.Session_Processor_ID = CreateSessionProcessor.data.id;
                waitfor.delay(body.delay);
              }
              catch (err) {
                finalresult.Entity[i].Processing_Channel[e].VISASetup.Session_Processor_ID = err.data;
              }
            }
            catch (err) {
              finalresult.Entity[i].Processing_Channel[e].VISASetup = { "VISA": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
            }
          }

          //Configure Mastercard
          console.log("Create Mastercard")
          if (body.Entity[i].Processing_channel[e].PaymentMethod.includes('MASTERCARD')) {
            try {
              //Create Manual processor
              console.log("Create Manual processor Mastercard")
              CreateProcessingProfile = await CATProcessingChannel.Create_Manual_processor_Mastercard(body.Bearer, ProcessingChannelID, body.Entity[i].Processing_channel[e].ProcessingChannelName)
              PPMastercard = CreateProcessingProfile.data.id
              finalresult.Entity[i].Processing_Channel[e].MastercardSetup = { "MASTERCARD": "CONFIGURED", "Processing_Profile_ID": CreateProcessingProfile.data.id };
              waitfor.delay(body.delay);
              try {
                //Create Session processor Profile
                console.log("Create Session processor Profile Mastercard")
                CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_Mastercard(body.Bearer, ProcessingChannelID, body.Entity[i].Processing_channel[e].ProcessingChannelName, PPMastercard)
                finalresult.Entity[i].Processing_Channel[e].MastercardSetup.Session_Processor_ID = CreateSessionProcessor.data.id;
                waitfor.delay(body.delay);
              }
              catch (err) {
                finalresult.Entity[i].Processing_Channel[e].MastercardSetup.Session_Processor_ID = err.data;
              }
            }
            catch (err) {
              finalresult.Entity[i].Processing_Channel[e].MastercardSetup = { "MASTERCARD": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
            }

          }

          //Configure Bancontact
          console.log("Create Bancontact")
          if (body.Entity[i].Processing_channel[e].PaymentMethod.includes('BANCONTACT')) {
            try {
              //Create Processing Profile
              console.log("Create Processing Profile Bancontact")
              CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Bancontact(body.Bearer, EntityID, body.Entity[i].Processing_channel[e].ProcessingChannelName)
              PPBancontact = CreateProcessingProfile.data.id
              finalresult.Entity[i].Processing_Channel[e].BancontactSetup = { "BANCONTACT": "CONFIGURED", "Processing_Profile_ID": CreateProcessingProfile.data.id };
              waitfor.delay(body.delay);
              try {
                //Create processor Profile
                console.log("Create processor Profile Bancontact")
                CreateProcessor = await CATProcessingChannel.Create_processing_processor_Bancontact(body.Bearer, ProcessingChannelID, PPBancontact)
                PrBancontact = CreateProcessor.data.id
                finalresult.Entity[i].Processing_Channel[e].BancontactSetup.Processing_Processor_ID = CreateProcessor.data.id;
                waitfor.delay(body.delay);
              }
              catch (err) {
                finalresult.Entity[i].Processing_Channel[e].BancontactSetup.Processing_Processor_ID = err.data;
              }
            }
            catch (err) {
              finalresult.Entity[i].Processing_Channel[e].BancontactSetup = { "BANCONTACT": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
            }
          }
          //Configure Ideal
          console.log("Create Ideal")
          if (body.Entity[i].Processing_channel[e].PaymentMethod.includes('IDEAL')) {
            try {
              //Create Processing Profile
              console.log("Create Processing Profile Ideal")
              CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Ideal(body.Bearer, EntityID, body.Entity[i].Processing_channel[e].ProcessingChannelName)
              PPIdeal = CreateProcessingProfile.data.id
              finalresult.Entity[i].Processing_Channel[e].Idealsetup = { "IDEAL": "CONFIGURED", "Processing_Profile_ID": CreateProcessingProfile.data.id };
              waitfor.delay(body.delay);
              try {
                //Create processor Profile
                console.log("Create processor Profile Ideal")
                CreateProcessor = await CATProcessingChannel.Create_processing_processor_Ideal(body.Bearer, ProcessingChannelID, PPIdeal)
                PrIdeal = CreateProcessor.data.id
                finalresult.Entity[i].Processing_Channel[e].Idealsetup.Processing_Processor_ID = CreateProcessor.data.id;
                waitfor.delay(body.delay);
              }
              catch (err) {
                finalresult.Entity[i].Processing_Channel[e].Idealsetup.Processing_Processor_ID = err.data;
              }
            }
            catch (err) {
              finalresult.Entity[i].Processing_Channel[e].Idealsetup = { "IDEAL": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
            }
          }

          //Configure Cartes_Bancaires
          if (body.Entity[i].Processing_channel[e].PaymentMethod.includes('CARTES_BANCAIRES')) {
            console.log("Create CB")
            try {
              //Create Processing Profile
              console.log("Create Processing Profile CB")
              CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_CB(body.Bearer, EntityID, body.Entity[i].Processing_channel[e].ProcessingChannelName)
              PPCb = CreateProcessingProfile.data.id
              finalresult.Entity[i].Processing_Channel[e].Cartes_BancairesSetup = { "CARTES_BANCAIRES": "CONFIGURED", "Processing_Profile_ID": PPCb };
              waitfor.delay(body.delay);
              console.log("PPCB created:", PPCb)
              try {
                //Create processor Profile
                console.log("Create processor Profile CB")
                CreateProcessor = await CATProcessingChannel.Create_processing_processor_CB(body.Bearer, ProcessingChannelID, PPCb)
                PrCb = CreateProcessor.data.id
                finalresult.Entity[i].Processing_Channel[e].Cartes_BancairesSetup.Processing_Processor_ID = CreateProcessor.data.id;
                waitfor.delay(body.delay);
                console.log("PrCb created:", PrCb)
                try {
                  console.log("Create Session processor Profile CB")
                  //Create Session processor Profile
                  console.log("wait 10 secondes")
                  waitfor.delay(10000);
                  CreateSessionProcessor = await CATProcessingChannel.Create_Session_processor_CB(body.Bearer, ProcessingChannelID, PPCb, PrCb)
                  finalresult.Entity[i].Processing_Channel[e].Cartes_BancairesSetup.Session_Processing_Profile_ID = CreateSessionProcessor.data.id;
                  waitfor.delay(body.delay);
                }
                catch (err) {
                  finalresult.Entity[i].Processing_Channel[e].Idealsetup.Processing_Processor_ID = err.data;
                }
              }
              catch (err) {
                finalresult.Entity[i].Processing_Channel[e].Idealsetup.Processing_Processor_ID = err.data;
              }
            }
            catch (err) {
              finalresult.Entity[i].Processing_Channel[e].Idealsetup = { "CB": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
            }
          }

          //Configure SEPA
          if (body.Entity[i].Processing_channel[e].PaymentMethod.includes('SEPA')) {
            console.log("Create SEPA")
            //Create Processing Profile
            try {
              console.log("Create Processing Profile SEPA")
              CreateProcessingProfile = await CATProcessingChannel.Create_Processing_profile_Sepa(body.Bearer, EntityID, body.Entity[i].Processing_channel[e].ProcessingChannelName)
              PPSepa = CreateProcessingProfile.data.id
              finalresult.Entity[i].Processing_Channel[e].SepaSetup = { "SEPA": "CONFIGURED", "Processing_Profile_ID": CreateProcessingProfile.data.id };
              waitfor.delay(body.delay);
              try {
                //Create processor Profile
                console.log("Create processor Profile SEPA")
                CreateProcessor = await CATProcessingChannel.Create_processing_processor_Sepa(body.Bearer, ProcessingChannelID, PPSepa)
                PrSepa = CreateIdealProcessor.data.id
                finalresult.Entity[i].Processing_Channel[e].SepaSetup.Processing_Processor_ID = CreateProcessor.data.id;
                waitfor.delay(body.delay);
              }
              catch (err) {
                finalresult.Entity[i].Processing_Channel[e].SepaSetup.Processing_Processor_ID = err.data;
              }
            }
            catch (err) {
              finalresult.Entity[i].Processing_Channel[e].SepaSetup = { "SEPA": "NOT CONFIGURED", "Processing_Profile_ID": err.data };
            }
          }
          //Configure Currency Account
          try {
            //Create Currency Account
            console.log("Create Currency Account")
            CreateCurrencyAccount = await CATProcessingChannel.Create_Currency_Account(body.Bearer, EntityID, body.Entity[i].Processing_channel[e].ProcessingChannelName)
            CurrencyAccountID = CreateCurrencyAccount.data.id
            finalresult.Entity[i].Processing_Channel[e].CurrencyAccountSetup = { "CURRENCY_ACCOUNT": "CONFIGURED", "Currency_Account_ID": CreateCurrencyAccount.data.id };
            waitfor.delay(body.delay);
            try {
              //Configure Routing payment rules
              console.log("Create Routing payment rules")
              CreateRoutingPaymentRules = await CATProcessingChannel.Create_Routing_Rules_Payment(body.Bearer, EntityID, ProcessingChannelID, CurrencyAccountID)
              RoutingPaymentRulesID = CreateRoutingPaymentRules.data.id
              finalresult.Entity[i].Processing_Channel[e].PaymentRoutingRulesSetup = { "PAYMENT_ROUTING_RULES": "CONFIGURED", "Payment_Routing_Rules_ID": CreateRoutingPaymentRules.data.id };
              waitfor.delay(body.delay);
            }
            catch (err) {
              finalresult.Entity[i].Processing_Channel[e].PaymentRoutingRulesSetup = { "PAYMENT_ROUTING_RULES": "NOT CONFIGURED", "Payment_Routing_Rules_ID": err.data };
            }
            try {
              //Configure Routing payout rules
              console.log("Create Routing payout rules")
              CreateRoutingPayoutRules = await CATProcessingChannel.Create_Routing_Rules_Payout(body.Bearer, EntityID, CurrencyAccountID)
              RoutingPayoutRulesID = CreateRoutingPayoutRules.data.id
              finalresult.Entity[i].Processing_Channel[e].CreateRoutingPayoutRules = { "PAYOUT_ROUTING_RULES": "CONFIGURED", "Payout_Routing_Rules_ID": CreateRoutingPayoutRules.data.id };
              waitfor.delay(body.delay);
            }
            catch (err) {
              finalresult.Entity[i].Processing_Channel[e].PayoutRoutingRulesSetup = { "PAYOUT_ROUTING_RULES": "NOT CONFIGURED", "Payout_Routing_Rules_ID": err.data };
            }
            try {
              //Configure Payout Schedule
              console.log("Create Payout Schedule")
              CreatePayoutSchedule = await CATProcessingChannel.Create_Payout_Schedules(body.Bearer, EntityID, body.Entity[i].Processing_channel[e].ProcessingChannelName, CurrencyAccountID)
              PayoutScheduleID = CreatePayoutSchedule.data.id
              finalresult.Entity[i].Processing_Channel[e].PayoutScheduleSetup = { "PAYOUT_SCHEDULE": "CONFIGURED", "Payout_Schedule_ID": CreatePayoutSchedule.data.id };
              waitfor.delay(body.delay);
            }
            catch (err) {
              finalresult.Entity[i].Processing_Channel[e].PayoutScheduleSetup = { "PAYOUT_SCHEDULE": "NOT CONFIGURED", "Payout_Schedule_ID": err.data };
            }
          }
          catch (err) {
            finalresult.Entity[i].Processing_Channel[e].CurrencyAccountSetup = { "CURRENCY_ACCOUNT": "NOT CONFIGURED", "Currency_Account_ID": err.data };
          }
        }
        catch (err) {
          console.log(err);
          return err
        }

      }
    }
    catch (err) {
      if (err?.response?.status) {
        if (err.response.status === 401) {
          return { "status": 401, "Message": "please renew the Bearer Token" }
        }
        if (err.response.status === 422) {
          finalresult = { "EntityID": "Error 422", "status": 422, "Message": err.response.data }
          return finalresult
        }
      }
      else {
        finalresult = { "EntityID": "Connection Error", "status": 500, "Message": "Check you VPN connection" }
        return finalresult
      }
    }
  }
  finalresult['status'] = 201
  return finalresult
}

module.exports = {
  Createconf
}