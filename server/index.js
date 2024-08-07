const express = require('express');
const app = express();
require('dotenv').config({ path: __dirname + '/var.env' })
require('dotenv').config();
var createError = require('http-errors');
var path = require('path');
var CatAPIRouter = require('./routes/CATAPI_Router');
var morgan = require('morgan');
var cors = require('cors');
const logger = require('./Utils/logger').logger;
const { Worker } = require("worker_threads");
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({ credentials: true, origin: '*' }));
app.options('*', cors());

app.use('/CatAPI', CatAPIRouter);
/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
*/
// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 4000;
DecodedJWT = {
    payload : {
        full_name : "Server"
    }
};
//baseURL = 'https://client-admin.cko-sbox.ckotech.co/';
CATENV = "Sandbox"
CorrelationID = "N/A";
//Addresse_IP = "127.0.0.1";
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
    logger.info(`Server running on port ${PORT}`, {status:"Running", source:"IndexFile"});
});

module.exports = app;