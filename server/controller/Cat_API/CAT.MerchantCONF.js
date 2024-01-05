const CATEntity = require('./CAT.EntityConf');
const CATProcessingChannel = require('./CAT.ProcessingChannelConf');
const waitfor = require('../IdempotencyKey');
const CatConfigInt = require('../Cat_API/CAT.ConfigInt');

async function Createconf2(body) {
    console.log("Number of entity requested :", body.Entity.length)
    finalresult = { "Entity": [] };
    console.log(body);
    for (let i = 0; i < body.Entity.length; i++) {
        //Entity check and creation
        try {
            if (body.Entity[i].hasOwnProperty('EntityID')) {
                console.log("Entity already created:", body.Entity[i].EntityID);
                EntityResult = await CATEntity.GetEntityData(body.Bearer, body.Entity[i].EntityID);
                finalresult.Entity.push({ "Entity_Name": EntityResult.data.name, "EntityID": EntityResult.data.id, "status": EntityResult.data.status });
                //Check if one Pricing Profile exist
                PricingProfileResult = await CATEntity.GetPricingProfile(body.Bearer, body.Entity[i].EntityID);
                if (PricingProfileResult.data.total_count > 1) {
                    //If Pricing Profile exist and there is more than one, then list them
                    finalresult.Entity[i].push({ "Pricing_Profile_ID": [] });
                    for (let ProcessingProfileNumber = 0; ProcessingProfileNumber < PricingProfileResult.data._embedded.pricing_profiles.length; ProcessingProfileNumber++) {
                        finalresult.Entity[i].Pricing_Profile_ID.push(PricingProfileResult.data._embedded.pricing_profiles[ProcessingProfileNumber].id);
                    }
                }
                else if (PricingProfileResult.data.total_count === 1) {
                    //If Pricing Profile exist and there is one, then list it
                    finalresult.Entity[i].Pricing_Profile_ID = PricingProfileResult.data._embedded.pricing_profiles[0].id;
                }
                else {
                    //If Pricing Profile dosen't exist, then create it
                    try {
                        console.log("Create Pricing Profile")
                        GetPricingProfile = await CATEntity.Create_Pricing_Profile(body.Entity[i].EntityLegalEntity, body.Bearer, EntityID, body.Entity[i].EntityName);
                        finalresult.Entity[i].Pricing_Profile_ID = GetPricingProfile.data.id;
                    }
                    catch (err) {
                        finalresult.Entity[i].Pricing_Profile_ID = err.data;
                    }
                };
                //Processing Channel configuration 
                finalresult.Entity[i].Processing_Channel = []
                for (let ProcessingChannelNumber = 0; ProcessingChannelNumber < body.Entity[i].Processing_channel.length; ProcessingChannelNumber++) {
                    if (body.Entity[i].Processing_channel[ProcessingChannelNumber].hasOwnProperty('ProcessingChannelID')) {
                        //If processing channel exist, then get data
                        console.log("Processing Channel already created :", body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID);
                        try {
                            GetProcessingChannelData = await CATProcessingChannel.GetProcessingChannelConf(body.Bearer, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID);
                            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelID, "Processing_Channel_Name": GetProcessingChannelData.data.name };
                        }
                        catch (err) {
                            console.log(err);
                            finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": "Error while creating" };
                        }
                        try {
                            GetVaultId = await CATEntity.GetVaultID(body.Bearer, body.ClientId);
                            VaultID = GetVaultId.data.id;
                            finalresult.Entity[i].VaultID = VaultID;
                        }
                        catch (err) {
                            console.log(err);
                            finalresult.Entity[i].VaultID = "Error while get VaultID";
                        }
                    }
                    else {
                        //If not, then Create Processing channel
                        console.log("Creating processing channel :", body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName);
                        PROCESSINGCHANNELCONF = await CatConfigInt.CreateProcessingChannel(body.Bearer, body.ClientId, body.Entity[i].EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName);
                        finalresult.Entity[i].VaultID = VaultID;
                        finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": ProcessingChannelID, "Processing_Channel_Name": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName };
                    }
                }
            }
            else {
                //Create Entity
                console.log("Creating entity :", body.Entity[i].EntityName);
                EntityResult = await CATEntity.CreateEntity(body.Bearer, body.ClientId, body.Entity[i].EntityName);
                waitfor.delay(body.delay);
                console.log("Entity creation status:", EntityResult.status);
                EntityID = EntityResult.data.id;
                finalresult.Entity.push({ "Entity_Name": body.Entity[i].EntityName, "EntityID": EntityID, "status": EntityResult.status });
                console.log("Entity :", body.Entity[i].EntityName, "was successfully created with the ID :", EntityID);
                //Create Pricing Profile
                try {
                    console.log("Create Pricing Profile")
                    GetPricingProfile = await CATEntity.Create_Pricing_Profile(body.Entity[i].EntityLegalEntity, body.Bearer, EntityID, body.Entity[i].EntityName);
                    finalresult.Entity[i].Pricing_Profile_ID = GetPricingProfile.data.id;
                }
                catch (err) {
                    finalresult.Entity[i].Pricing_Profile_ID = err.data;
                }
                finalresult.Entity[i].Processing_Channel = []
                for (let ProcessingChannelNumber = 0; ProcessingChannelNumber < body.Entity[i].Processing_channel.length; ProcessingChannelNumber++) {
                    console.log("Creating processing channel :", body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName);
                    PROCESSINGCHANNELCONF = await CatConfigInt.CreateProcessingChannel(body.Bearer, body.ClientId, EntityID, body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName);
                    finalresult.Entity[i].VaultID = VaultID;
                    finalresult.Entity[i].Processing_Channel[ProcessingChannelNumber] = { "Processing_Channel_ID": ProcessingChannelID, "Processing_Channel_Name": body.Entity[i].Processing_channel[ProcessingChannelNumber].ProcessingChannelName };

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
                console.log(err)
                finalresult = { "EntityID": "Connection Error", "status": 500, "Message": "Check you VPN connection" }
                return finalresult
            }
        }
    }
    finalresult['status'] = 201
    return finalresult
}

module.exports = {
    Createconf2
}