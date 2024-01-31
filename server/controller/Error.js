
function ErrorHandling(err) {
    if (err?.response) {
        if (err.response.status === 401) {
            return { "status": err.response.status, "Error_Message": "Bearer invalid or expired" }
        }
        else {
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