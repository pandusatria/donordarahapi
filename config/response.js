'use strict';

module.exports = {
    send : (res, statuscode, message) => {
        let resp = {};
        resp.status = statuscode;
        resp.message = message;
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(statuscode, resp);
    }
};