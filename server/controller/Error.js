
function ErrorHandling(err) {
    if (err?.response?.data) {
        return { "HTTP_Code": err.response.status, "Error_Message": err.response.data }
    }
    else if (err?.response?.status) {
        if (err.response.status === 401){
        return { "HTTP_Code": err.response.status, "Error_Message": "Bearer invalid or expired" }
    }
    }
    else if (err.code === "ENOMEM") {
        return "Connection ERROR"
    }
    else {

        return err
    }
}
module.exports = {
    ErrorHandling
};