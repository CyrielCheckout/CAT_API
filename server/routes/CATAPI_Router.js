var express = require('express');
require('dotenv').config();
var router = express.Router();
const CATConfigureMerchant = require("../controller/Cat_API/CAT.CreationBatch")
const CATGetMerchantConf = require("../controller/Cat_API/CAT.GetMerchantConf")
const CATMerchantConf = require("../controller/Cat_API/CAT.MerchantConfiguration")
const CATMerchantConf2 = require("../controller/Cat_API/CAT.MerchantCONF")

router.post('/Createconf2', async function (req, res, next) {
    console.log("Got body :", req.body)
    CreateMerchantCAT = await CATMerchantConf2.Createconf2(req.body)
    res
        .status(CreateMerchantCAT.status)
        .json(CreateMerchantCAT);

})

router.post('/AddEntity', async function (req, res, next) {
    console.log("Got body :", req.body)
    CreateMerchantCAT = await CATConfigureMerchant.Createconf(req.body)
    res
        .status(CreateMerchantCAT.status)
        .json(CreateMerchantCAT);

})
router.post('/GetMerchantConf', async function (req, res, next) {
    console.log("Got body :", req.body)
    GetMerchantConf = await CATGetMerchantConf.GetConf(req.body)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(GetMerchantConf.status).json(GetMerchantConf);
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
module.exports = router;