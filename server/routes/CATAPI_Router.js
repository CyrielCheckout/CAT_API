var express = require('express');
require('dotenv').config();
var router = express.Router();
//const CATConfigureMerchant = require("../controller/Cat_API/CAT.CreationBatch")
const path = require('path');
const fs = require('fs');
const ErrorHandling = require('../controller/Error');
//const CATGetMerchantConf = require("../controller/Cat_API/[Batch]GetMerchantConf");
//const CATMerchantConf = require("../controller/Cat_API/[Batch].Merchant_Main_Method");
const logger = require("../Utils/logger.js").logger;
const jwtJsDecode = require('jwt-js-decode');
const { Worker } = require("worker_threads");
const readline = require('readline');
var correlator = require("correlation-id");
/*router.post('/ConfigureMerchant', async function (req, res, next) {
    console.log("Got body :", req.body)
    DecodedJWT = jwtJsDecode.decode(req.body.Bearer.slice(7));
    logger.info(`Message: requested ConfigMerchant for ClientID  ${req.body.ClientId}, with payload ${JSON.stringify(req.body)}, source: Route_ConfigureMerchant`);
    CreateMerchantCAT = await CATMerchantConf.Createconf(req.body)
    res
        .status(CreateMerchantCAT.status)
        .json(CreateMerchantCAT);

})*/
router.post('/ConfigureMerchant', async function (req, res, next) {
    DecodedJWT = jwtJsDecode.decode(req.body.Bearer.slice(7));
    CorrelationID = correlator.withId(() => {
        return correlator.getId();
    });
    Addresse_IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Got body :", req.body);
    logger.info(`requested ConfigMerchant for ClientID  ${req.body.ClientId}`, { payload: req.body, source: "Route_ConfigureMerchant" });
    const worker = new Worker('./server/controller/Cat_API/[Batch]Merchant_Main_Method.js', { workerData: req.body });
    worker.on('message', (result) => {
        res.status(result.status || 500);
        res.json(result || "FATAL ERROR PLEASE CHECK THE LOG");
    });
    worker.postMessage({ body: req.body, DecodedJWT: DecodedJWT, CorrelationID: CorrelationID,ENV:req.body.Env });
    worker.on('error', (error) => {
        console.error('Worker error:', error);
        console.log(error)
        res.status(error.status || 500).json(error || {error:"Internal server error"});
    });
});

router.post('/ConfigurePayfac', async function (req, res, next) {
    DecodedJWT = jwtJsDecode.decode(req.body.Bearer.slice(7));
    CorrelationID = correlator.withId(() => {
        return correlator.getId();
    });
    Addresse_IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Got body :", req.body);
    logger.info(`requested ConfigMerchant for ClientID  ${req.body.ClientId}`, { payload: req.body, source: "Route_ConfigureMerchant" });
    const worker = new Worker('./server/controller/Cat_API/[Batch]Merchant_Main_Method.js', { workerData: req.body });
    worker.on('message', (result) => {
        res.status(result.status || 500);
        res.json(result || "FATAL ERROR PLEASE CHECK THE LOG");
    });
    worker.postMessage({ body: req.body, DecodedJWT: DecodedJWT, CorrelationID: CorrelationID,ENV:req.body.Env });
    worker.on('error', (error) => {
        console.error('Worker error:', error);
        console.log(error)
        res.status(error.status || 500).json(error || {error:"Internal server error"});
    });
});


router.get('/GetLogs', async function (req, res, next) {
    DecodedJWT.payload.full_name = "logrequest";
    Addresse_IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const directoryPath = path.join(__dirname, '../../logs');
    filesArray = [];
    try {
        fs.readdir(directoryPath, await function (err, files) {
            //handling error
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                //console.log(file);
                if (file.includes("json")) {
                    console.log("GetLogs, Json file removed")
                }
                else {
                    filesArray.push(file)
                }
            });
            console.log(filesArray)
            res
                .status(200)
                .json(filesArray);

        });
    }
    catch (err) {
        res
            .status(500)
        throw ErrorHandling.ErrorHandling(err, "GetLogs");
    }
})
router.get('/GetLogs/:logname', async function (req, res, next) {
    DecodedJWT.payload.full_name = "logrequest";
    Addresse_IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    filePath = path.join(__dirname, `../../logs/${req.params.logname}`);
    //try {
    const readLogsFromFile = (filePath) => {
        return new Promise((resolve, reject) => {
            const logEntries = [];

            const fileStream = fs.createReadStream(filePath);
            const rl = readline.createInterface({
                input: fileStream,
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                try {
                    const logEntry = JSON.parse(line);
                    logEntries.push(logEntry);
                } catch (err) {
                    console.error('Error parsing log line:', err);
                }
            });

            rl.on('close', () => {
                resolve(logEntries);
            });

            rl.on('error', (err) => {
                reject(err);
            });
        });
    };
    await readLogsFromFile(filePath)
        .then((logEntries) => {
            LogDataJson = JSON.stringify(logEntries, null, 2);
            logger.info(`Log requested : ${req.params.logname} and successfully sent`, `source: Route_GetLogs_${req.params.logname}`);
        })
        .catch((err) => {
            LogDataJson = 'Error reading log file:', err;
            logger.error(`Log requested : ${req.params.logname} but error : ${err}`, `source: Route_GetLogs_${req.params.logname}`);
        });
    res.setHeader('content-type', 'application/json');
    res
        .send(LogDataJson)
        .status(200);
    /* const filePath = path.join(__dirname, `../../logs/${req.params.logname}`);
     var stat = fs.statSync(filePath);
     res.writeHead(200, {
         'Content-Type': 'json',
         'Content-Length': stat.size
     });
     var readStream = fs.createReadStream(filePath);
     // We replaced all the event handlers with a simple call to readStream.pipe()
     readStream.pipe(res);
     res
         .status(200);
 }
 catch (err) {
     res
         .status(404)
     throw ErrorHandling.ErrorHandling(err, "GetLogs/:logname");
 }*/
})
//Not used anymore
/*
router.post('/AddEntity', async function (req, res, next) {
    console.log("Got body :", req.body)
    CreateMerchantCAT = await CATConfigureMerchant.Createconf(req.body)
    res
        .status(CreateMerchantCAT.status)
        .json(CreateMerchantCAT);

})

router.post('/AddProcessingChannel', async function (req, res, next) {
    console.log("Got body :", req.body)
    AddProcessingChannel = await CATMerchantConf.AddProcessingChannel(req.body)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(AddProcessingChannel.status).json(AddProcessingChannel);
})
router.post('/AddPaymentMethod', async function (req, res, next) {
  console.log("Got body :", req.body)
  AddPaymentMethodResult = await CATMerchantConf.AddPaymentMethod(req.body)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.status(AddPaymentMethodResult.status).json(AddPaymentMethodResult);
})
*/

router.post('/GetMerchantConf', async function (req, res, next) {
    DecodedJWT = jwtJsDecode.decode(req.body.Bearer.slice(7));
    CorrelationID = correlator.withId(() => {
        return correlator.getId();
    });
    Addresse_IP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log("Got body :", req.body);
    logger.info(`requested GetMerchantConf for ClientID  ${req.body.ClientId}`, { payload: req.body, source: "Route_GetMerchantConf" });
    const worker = new Worker('./server/controller/Cat_API/[Batch]GetMerchantConf.js', { workerData: req.body });
    worker.on('message', (result) => {
        res.status(result.status || 500);
        res.json(result || "FATAL ERROR PLEASE CHECK THE LOG");
    });
    worker.postMessage({ body: req.body, DecodedJWT: DecodedJWT, CorrelationID: CorrelationID, ENV:req.body.Env });
    worker.on('error', (error) => {
        console.error('Worker error:', error);
        res.status(error.status || 500).json({error}|| {error :"Internal server error"});
    });
    //GetMerchantConf = await CATGetMerchantConf.GetConf(req.body)
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.status(GetMerchantConf.status).json(GetMerchantConf);
})
module.exports = router;