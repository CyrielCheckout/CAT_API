const loggerInfo = require('../Utils/logger').loggerInfo;
const loggerError = require('../Utils/logger').loggerError;
function ErrorHandling(err,source) {
    loggerError.error( err, 'CAT_API');
    if (err?.response) {
        if (err.response.status === 401) {
            loggerError.error({"HTTP_Status_Code": err.response.status, "Message" : "Bearer invalid or expired"});
            return { "status": err.response.status, "Error_Message": "Bearer invalid or expired" , "source":source}
        }
        else {
            //loggerError.error( 'HTTP code : '+err.response.status+' '+JSON.stringify(err.response.data), 'CAT_API');
            console.log({ "status": err.response.status, "Error_Message": err.response.data , "source":source})
            return { "status": err.response.status, "Error_Message": err.response.data }
        }
    }
    else if (err?.code) {
        if (err.code === "ENOMEM") {
            console.log("Warn error :", err.code, " source :",source)
            return { "Error_type": "Connection Error", "status": 500, "Message": "Connection error, please check your internet connection / VPN connection" , "source":source}
        }
        else if (err.code === "ECONNABORTED") {
            console.log("Warn error :", err.code, " source :",source)
            return { "Error_type": "Timeout", "status": 500, "Message": "Timeout, please check your internet connection / VPN connection", "source":source }
        }
        else if (err.code === "ECONNRESET") {
            console.log("Warn error :", err.code, " source :",source)
            return { "Error_type": "ECONNRESET", "status": 500, "Message": "Network connection reset" , "source":source}
        }
        else if (err.code === "ERR_BAD_REQUEST") {
            console.log("Warn error :", err.code, " source :",source)
            return { "Error_type": "ERR_BAD_REQUEST", "status": 500, "Message": err.data , "source":source}
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