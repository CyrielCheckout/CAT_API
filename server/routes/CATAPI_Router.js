var express = require('express');
require('dotenv').config();
var router = express.Router();
const CATCreateMerchant = require("../controller/Cat_API/CAT.CreationBatch")
const CATGetMerchantConf = require("../controller/Cat_API/CAT.GetMerchantConf")
const CATEntity = require("../controller/Cat_API/CAT.Entity")


router.post('/CATCreateMerchant', async function (req, res, next) {
    console.log("Got body :", req.body)
        CreateMerchantCAT = await CATCreateMerchant.Createconf(req.body)
        res
            .status(CreateMerchantCAT.status)
            .json(CreateMerchantCAT);

})

router.get('/GetMerchantConf', async function (req, res, next) {
    console.log("Got body :", req.body)
        GetMerchantConf = await CATGetMerchantConf.GetConf(req.body)
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(GetMerchantConf.status).json(GetMerchantConf);
  })

router.get('/getAllEntlty', async function (req, res, next) {
    console.log("Got body :", req.body)
        GetAllEntity = await CATEntity.GetAllEntity(req.body.Bearer,req.body.ClientId)
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(GetAllEntity.status).json(GetAllEntity);
  })
module.exports = router;