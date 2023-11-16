var express = require('express');
require('dotenv').config();
var router = express.Router();
const CATCreateMerchant = require("../controller/Cat_API/CAT.CreationBatch")

router.post('/CATCreateMerchant', async function (req, res, next) {
    console.log("Got body :", req.body)
        CreateMerchantCAT = await CATCreateMerchant.Createconf(req.body)
        res.status(CreateMerchantCAT.status).json(CreateMerchantCAT);

})

module.exports = router;