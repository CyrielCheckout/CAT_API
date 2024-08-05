const logger = require('../Utils/logger').logger;
function ErrorHandling(err, source) {
    if (err?.response) {
        if (err.response.status === 401) {
            logger.error("Bearer invalid or expired", {Error_type:err.response.statusText, HTTP_Status_Code: err.response.status, source: source });
            return { "Error_type":err.response.statusText, "status": err.response.status, "Error_Message": "Bearer invalid or expired", "source": source }
        }
        else {
            logger.error(JSON.stringify(err.response.data), {Error_type:err.response.statusText, HTTP_Status_Code: err.response.status, source: source });
            return {"Error_type":err.response.statusText, "status": err.response.status, "Error_Message": err.response.data, "source": source }
        }
    }
    else if (err?.code) {
        if (err.code === "ENOMEM") {
            logger.error("Connection Error - Connection error, please check your internet connection / VPN connection", { HTTP_Status_Code: err.code, source: source });
            return { "Error_type": "FATAL_ERROR", "status": "Connection Error", "Message": "Connection error, please check your internet connection / VPN connection", "source": source }
        }
        else if (err.code === "ECONNABORTED") {
            logger.error("Timeout - Timeout, please check your internet connection / VPN connection", { HTTP_Status_Code: err.code, source: source });
            return { "Error_type": "FATAL_ERROR", "status": "Timeout", "Message": "Timeout, please check your internet connection / VPN connection", "source": source }
        }
        else if (err.code === "ECONNRESET") {
            logger.error("ECONNRESET - Network connection reset", { HTTP_Status_Code: err.code, source: source });
            return { "Error_type": "FATAL_ERROR", "status": "ECONNRESET", "Message": "Network connection reset", "source": source }
        }
        else if (err.code === "ERR_BAD_REQUEST") {
            logger.error("ERR_BAD_REQUEST - ERR_BAD_REQUEST", { HTTP_Status_Code: err.code, source: source });
            return { "Error_type": "FATAL_ERROR", "status": "ERR_BAD_REQUEST", "Message": err.data, "source": source }
        }
        else {
            logger.error("Unknown - " + err.data, { HTTP_Status_Code: err.code, source: source });
            return { "Error_type": "Unknown", "status": err.code, "Message": err.data, "source": source }
        }
    }
    else {
        if (err.toString().includes("ReferenceError: ")) {
            errString = err.toString().replace("ReferenceError: ", '');
            logger.error(`${errString}`, { HTTP_Status_Code: errString.code || 500, source: source });
            return { "Error_type": "ReferenceError", "status": 500, "Message": errString.data || errString, "source": source };
        }
        else if(err?.Error_type){
            return err
        }
        else {
            logger.error(`${err.data || err.Error_Message || err}`, { HTTP_Status_Code: err.code || err.status || 500, source: source });
            //console.log(err)
            return { "Error_type": err?.Error_Message?.error_type || "FATAL_ERROR", "status": err?.code || err?.status || 500, "Message": err?.data || err?.Error_Message || err, "source": source };
        }
    }
}
module.exports = {
    ErrorHandling
};