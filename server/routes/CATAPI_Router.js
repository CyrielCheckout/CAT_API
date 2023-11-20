var express = require('express');
require('dotenv').config();
var router = express.Router();
const CATCreateMerchant = require("../controller/Cat_API/CAT.CreationBatch")

router.post("/test", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json({ message: "Hello!" });
  });

router.post('/CATCreateMerchant', async function (req, res, next) {
    console.log("Got body :", req.body)
        CreateMerchantCAT = await CATCreateMerchant.Createconf(req.body)
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.status(CreateMerchantCAT.status).json(CreateMerchantCAT);

})

module.exports = router;