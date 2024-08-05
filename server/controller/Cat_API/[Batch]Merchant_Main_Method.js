const CATEntity = require('./[CAT]Entity_API');
const CATEntityConf = require('./[Batch]Entity_Configuration_Method');
const CATEntityConfPayfac = require('../Cat_API/PayFac/Regulated/[Batch]Payfac_Configuration_Methode');
const logger = require('../../Utils/logger').logger;
const { parentPort, workerData } = require('worker_threads');
const jwtJsDecode = require('jwt-js-decode');
const ErrorHandling = require('../Error');
async function Createconf(body) {
    try {
        GetAllEntity = await CATEntity.GetAllEntity(body.Bearer, body.ClientId, 25);
    }
    catch (err) {
        logger.error(`Error while getAllEntity: ${err}`, { source: "Createconf" });
        return ErrorHandling.ErrorHandling(err, "Createconf_GetAllEntity");
    }
    finalresult = { "Entity": [] };
    //GetVaultID
    try {
        logger.info(`Get Vault ID`, { source: "Createconf_GetVaultID" });
        GetVaultId = await CATEntity.GetVaultID(body.Bearer, body.ClientId);
        VaultID = GetVaultId.data.id;
        finalresult.VaultID = VaultID;
        logger.info(`Vault ID = ${VaultID}`, { source: "Createconf_GetVaultID" });
    }
    catch (err) {
        if (err.status === 404) {
            logger.error(`Vault configuration missing`, { HTTP_Status_Code: err.code, source: "Createconf_GetVaultID" });
            logger.info(`Configuring Vault`, { source: "Createconf_GetVaultID" });
            try {
                CreateVaultID = await CATEntity.CreateVaultID(body.Bearer, body.ClientId);
                logger.info(`Get Vault ID`, { source: "Createconf_CreateVaultID" });
                GetVaultId = await CATEntity.GetVaultID(body.Bearer, body.ClientId);
                VaultID = GetVaultId.data.id;
                finalresult.VaultID = VaultID;
                logger.info(`Vault ID = ${VaultID}`, { source: "Createconf_CreateVaultID" });
            }
            catch (err) {
                logger.error(`${err}`, { source: "Createconf_CreateVaultID" });
                return ErrorHandling.ErrorHandling(err, "Createconf_CreateVaultID");
            }
        }
        else {
            logger.error(`${err}`, { source: "Createconf" });
            return ErrorHandling.ErrorHandling(err, "Createconf_GetVaultId");
        }

    }
    for (let i = 0; i < body.Entity.length; i++) {
        //Entity check and creation
        try {
            //check if entity entity ID is sent
            if (body?.Entity[i]?.EntityID?.length > 0) {
                //if yes, then entity already exist! 
                await CATEntityConf.ExistingEntity(body, i, VaultID)
            }
            else {
                //Create Entity
                if (body?.Entity[i]?.BusinessModel === "PAYFAC_REGULATED") {
                    await CATEntityConfPayfac.NewPayfacRegulatedEntity(body, i, VaultID)
                }
                else {
                    await CATEntityConf.NewEntity(body, i, VaultID)
                }

            }
        }
        catch (err) {
            logger.error(`${err}`, { source: "Createconf" });
            return ErrorHandling.ErrorHandling(err, "Createconf_CheckifEntityExist");
        }
    }
    finalresult['status'] = 202
    return finalresult
};

parentPort.once('message', async (message) => {
    DecodedJWT = message.DecodedJWT;
    CorrelationID = message.CorrelationID;
    if (message.ENV === "Prod") {
        CATENV = "Production"
        throw ErrorHandling.ErrorHandling("Create merchant can't be performed on production env", "Createconf_WorkerInit");
    }
    baseURL = 'https://client-admin.cko-sbox.ckotech.co/';
    hostURL = baseURL.replace('https://', '').replace('/', '');
    CATENV = "Sandbox"
    CreateConfResult = await Createconf(message.body);
    parentPort.postMessage(CreateConfResult);
});

module.exports = {
    Createconf
}