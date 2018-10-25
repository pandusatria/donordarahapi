'use strict';

var winston = require('../config/winston');
var morgan = require('morgan');
var client = require('../controllers/m_client');
var user = require('../controllers/m_user');
var role = require('../controllers/m_role');
var pendonor = require('../controllers/t_pendonor');
var middleware = require('../middleware/checktoken');
var validate = require("../controllers/validate");
var menu = require("../controllers/m_menu");

module.exports = exports = function(server){

    // CORS
    var corsMiddleware = require('restify-cors-middleware');
    var cors = corsMiddleware({
        origins : ['*'],
        allowHeaders : ['authorization']
    });

    server.pre(cors.preflight);
    server.use(cors.actual);

    // Client Route
    server.get('/api/client/', middleware.checkToken, client.GetAllHandler);
    server.get('/api/client/:id', middleware.checkToken, client.GetDetailByIDHandler);
    server.post('/api/client/', middleware.checkToken, client.CreateHandler);
    server.put('/api/client/:id', middleware.checkToken, client.UpdateHandler);
    server.post('/api/client/delete/:id', middleware.checkToken, client.DeleteHandler);

    // Role Route
    server.get('/api/role/', middleware.checkTokenAndRoleAdmin, role.GetAllHandler);
    server.get('/api/role/:id', middleware.checkTokenAndRoleAdmin, role.GetDetailByIDHandler);
    server.post('/api/role/', middleware.checkTokenAndRoleAdmin, role.CreateHandler);
    server.put('/api/role/:id', middleware.checkTokenAndRoleAdmin, role.UpdateHandler);
    server.del('/api/role/:id', middleware.checkTokenAndRoleAdmin, role.DeleteHandler);

    // User Route
    server.post('/api/user/login', user.LoginHandler);
    server.get('/api/user/logout', user.LogoutHandler);
    server.get('/api/user/', middleware.checkTokenAndRoleAdmin, user.GetAllHandler);
    server.get('/api/user/:id', middleware.checkToken, user.GetDetailByIDHandler);
    server.post('/api/user/', middleware.checkTokenAndRoleAdmin, user.CreateHandler);
    server.put('/api/user/:id', middleware.checkToken, user.UpdateHandler);
    server.del('/api/user/:id', middleware.checkTokenAndRoleAdmin, user.DeleteHandler);

    // Pendonor Route
    server.get('/api/pendonor/', middleware.checkToken, pendonor.GetAllHandler);
    server.get('/api/pendonor/:id', middleware.checkToken, pendonor.GetDetailByIDHandler);
    server.post('/api/pendonor/', middleware.checkToken, pendonor.CreateHandler);
    server.put('/api/pendonor/:id', middleware.checkToken, pendonor.UpdateHandler);
    server.del('/api/pendonor/:id', middleware.checkToken, pendonor.DeleteHandler);

    // Validate Route
    server.get('/api/validate/checkclient/:name', middleware.checkToken, validate.ClientCheckNameHandler);
    server.get('/api/validate/checkrole/:name', middleware.checkToken, validate.RoleCheckNameHandler);

    // Menu Route
    server.get('/api/menu/getloginmenu/', middleware.checkToken, menu.GetMenuLoginHandler);

    // error handler
    server.use(function(err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        if (err.name === 'UnauthorizedError') {
            res.status(401).json({ status: 0, code: 401, type: "unauthorized", message: err.name + ": " + err.message });
        } else {
            res.status(404).json({ status: 0, code: 404, type: "ENOENT", message: "file not found" });
        }

        res.status(err.status || 500);
        res.render('error');
    });

    server.use(morgan('combined', { stream: winston.stream }));
};