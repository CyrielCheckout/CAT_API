var express = require('express');
require('dotenv').config();
var router = express.Router();
//const CATConfigureMerchant = require("../controller/Cat_API/CAT.CreationBatch")
const path = require('path');
const fs = require('fs');
const CATGetMerchantConf = require("../controller/Cat_API/CAT.GetMerchantConf")
const CATMerchantConf = require("../controller/Cat_API/CAT.MerchantCONF")

router.post('/ConfigureMerchant', async function (req, res, next) {
    console.log("Got body :", req.body)
    CreateMerchantCAT = await CATMerchantConf.Createconf(req.body)
    res
        .status(CreateMerchantCAT.status)
        .json(CreateMerchantCAT);

})
router.get('/GetLogs', async function (req, res, next) {
    const directoryPath = path.join(__dirname, '../../logs');
    filesArray = [];
    fs.readdir(directoryPath, await function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            //console.log(file);
            filesArray.push(file)
        });
        console.log(filesArray)
        res
            .status(200)
            .json(filesArray);

    });
})
router.get('/GetLogs/:logname', async function (req, res, next) {
    const filePath = path.join(__dirname, `../../logs/${req.params.logname}`);
    var stat = fs.statSync(filePath);
    res.writeHead(200, {
        'Content-Type': 'json',
        'Content-Length': stat.size
    });
    var readStream = fs.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
    res
            .status(200)
            //.json(readStream);

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
    console.log("Got body :", req.body)
    GetMerchantConf = await CATGetMerchantConf.GetConf(req.body)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(GetMerchantConf.status).json(GetMerchantConf);
})
module.exports = router;