const logger = require('../Utils/logger').logger;
function ErrorHandling(err) {
    logger.error( err, 'CAT_API');
    if (err?.response) {
        if (err.response.status === 401) {
            logger.error( 'HTTP code : '+err.response.status+' Bearer invalid or expired', 'CAT_API');
            return { "status": err.response.status, "Error_Message": "Bearer invalid or expired" }
        }
        else {
            logger.error( 'HTTP code : '+err.response.status+' '+err.response.data, 'CAT_API');
            return { "status": err.response.status, "Error_Message": err.response.data }
        }
    }
    else if (err?.code) {
        if (err.code === "ENOMEM") {
            console.log("Warn error :", err.code)
            finalresult = { "Error_type": "Connection Error", "status": 500, "Message": "Connection error, please check your internet connection / VPN connection" }
            return finalresult
        }
        else if (err.code === "ECONNABORTED") {
            console.log("Warn error :", err.code)
            finalresult = { "Error_type": "Timeout", "status": 500, "Message": "Timeout, please check your internet connection / VPN connection" }
            return finalresult
        }
        else {
            return err.code
        }
    }
    else {
        return err
    }
}
module.exports = {
    ErrorHandling
};