var express = require('express');
require('dotenv').config();
var router = express.Router();
const CATConfigureMerchant = require("../controller/Cat_API/CAT.CreationBatch")
const CATGetMerchantConf = require("../controller/Cat_API/CAT.GetMerchantConf")
const CATEntity = require("../controller/Cat_API/CAT.Entity")
const CATMerchantConf = require("../controller/Cat_API/CAT.MerchantConfiguration")


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

router.get('/getAllEntlty', async function (req, res, next) {
    console.log("Got body :", req.body)
    GetAllEntity = await CATEntity.GetAllEntity(req.body.Bearer, req.body.ClientId)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(GetAllEntity.status).json(GetAllEntity);
})
module.exports = router;