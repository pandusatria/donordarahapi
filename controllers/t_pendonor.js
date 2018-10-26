'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const pendonorModel = require('../models/t_pendonor.model');

var now = new Date();

const PendonorController = {
    GetAllHandler : (req, res, next) => {
        global.dbo.collection('t_pendonor').find({status : false}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            let modelCollection = data.map((entity) => {
                return new pendonorModel(entity);
            });

            Response.send(res, 200, modelCollection);
        });
    },
    GetDetailByIDHandler : (req, res, next) => {
        let id = req.params.id;
        global.dbo.collection('t_pendonor').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            let model = data.map((entity) => {
                return new pendonorModel(entity);
            });

            Response.send(res, 200, model);
        });
    },
    CreateHandler : (req, res, next) => {
        let reqdata = req.body;
        var data = {};

        data.nama_lengkap   =   reqdata.nama_lengkap;
        data.no_ktp         =   reqdata.no_ktp;
        data.tanggal_lahir  =   new Date(reqdata.tanggal_lahir);
        data.alamat         =   reqdata.alamat;
        data.jenis_kelamin  =   reqdata.jenis_kelamin;
        data.no_telp        =   reqdata.no_telp;
        data.tanggal_donor  =   now;
        data.status_donor   =   "Baru";
        data.id_goldarah    =   ObjectID(reqdata.id_goldarah);
        data.created_date = now;
        data.created_by = global.user.username;
        data.updated_date = null;
        data.updated_by = null;
        data.status = false;

        console.log(data);

        var model = new pendonorModel(data);

        global.dbo.collection('t_pendonor').insertOne(model, function(err, data){
            if(err)
            {
                return next(new Error());
            }

            Response.send(res, 200, data);
        });
    },
    UpdateHandler : (req, res, next) => {
        let id = req.params.id;
        let body = req.body;
        var oldmodel = {};
        var updatemodel = {};

        global.dbo.collection('t_pendonor').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new pendonorModel(entity);
            });

            if(body.nama_lengkap == null || body.nama_lengkap == undefined || body.nama_lengkap == "")
            {
                updatemodel.nama_lengkap = oldmodel[0].nama_lengkap;
            }
            else
            {
                updatemodel.nama_lengkap = body.nama_lengkap;
            }

            if(body.no_ktp == null || body.no_ktp == undefined || body.no_ktp == "")
            {
                updatemodel.no_ktp = oldmodel[0].no_ktp;
            }
            else
            {
                updatemodel.no_ktp = body.no_ktp;
            }

            if(body.tanggal_lahir == null || body.tanggal_lahir == undefined || body.tanggal_lahir == "")
            {
                updatemodel.tanggal_lahir = oldmodel[0].tanggal_lahir;
            }
            else
            {
                updatemodel.tanggal_lahir = new Date(body.tanggal_lahir);
            }

            if(body.alamat == null || body.alamat == undefined || body.alamat == "")
            {
                updatemodel.alamat = oldmodel[0].alamat;
            }
            else
            {
                updatemodel.alamat = body.alamat;
            }

            if(body.jenis_kelamin == null || body.jenis_kelamin == undefined || body.jenis_kelamin == "")
            {
                updatemodel.jenis_kelamin = oldmodel[0].jenis_kelamin;
            }
            else
            {
                updatemodel.jenis_kelamin = body.jenis_kelamin;
            }

            if(body.no_telp == null || body.no_telp == undefined || body.no_telp == "")
            {
                updatemodel.no_telp = oldmodel[0].no_telp;
            }
            else
            {
                updatemodel.no_telp = body.no_telp;
            }

            if(body.tanggal_donor == null || body.tanggal_donor == undefined || body.tanggal_donor == "")
            {
                updatemodel.tanggal_donor = oldmodel[0].tanggal_donor;
            }
            else
            {
                updatemodel.tanggal_donor = new Date(body.tanggal_donor);
            }

            if(body.status_donor == null || body.status_donor == undefined || body.status_donor == "")
            {
                updatemodel.status_donor = oldmodel[0].status_donor;
            }
            else
            {
                updatemodel.status_donor = body.status_donor;
            }

            if(body.id_goldarah == null || body.id_goldarah == undefined || body.id_goldarah == "")
            {
                updatemodel.id_goldarah =  ObjectID(oldmodel[0].id_goldarah);
            }
            else
            {
                updatemodel.id_goldarah =  ObjectID(body.id_goldarah);
            }

            updatemodel._id = ObjectID(id);
            updatemodel.created_date = oldmodel[0].created_date;
            updatemodel.created_by = oldmodel[0].created_by;
            updatemodel.updated_date = now;
            updatemodel.updated_by = global.user.username;
            updatemodel.status = false;

            console.log(updatemodel);

            var model = new pendonorModel(updatemodel);

            global.dbo.collection('t_pendonor').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        return next(new Error());
                    }

                    Response.send(res, 200, data);
                }
            );
        });
    },
    DeleteHandler : (req, res, next) => {
        let id = req.params.id;
        var oldmodel = {};
        var deletemodel = {};

        global.dbo.collection('t_pendonor').find({status : false, '_id' : ObjectID(id)}).toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            oldmodel = data.map((entity) => {
                return new pendonorModel(entity);
            });

            deletemodel._id = ObjectID(id);
            deletemodel.nama_lengkap   =   oldmodel[0].nama_lengkap;
            deletemodel.no_ktp         =   oldmodel[0].no_ktp;
            deletemodel.tanggal_lahir  =   oldmodel[0].tanggal_lahir;
            deletemodel.alamat         =   oldmodel[0].alamat;
            deletemodel.jenis_kelamin  =   oldmodel[0].jenis_kelamin;
            deletemodel.no_telp        =   oldmodel[0].no_telp;
            deletemodel.tanggal_donor  =   oldmodel[0].tanggal_donor;
            deletemodel.status_donor   =   oldmodel[0].status_donor;
            deletemodel.id_goldarah    =   ObjectID(oldmodel[0].id_goldarah);
            deletemodel.created_date = oldmodel[0].created_date;
            deletemodel.created_by = oldmodel[0].created_by;
            deletemodel.updated_date = now;
            deletemodel.updated_by = global.user.username;
            deletemodel.status = true;

            var model = new pendonorModel(deletemodel);

            global.dbo.collection('t_pendonor').findOneAndUpdate
            (
                {'_id' : ObjectID(id)},
                {$set: model},
                function(err, data){
                    if(err)
                    {
                        return next(new Error());
                    }

                    Response.send(res, 200, data);
                }
            );
        });
    }
};

module.exports = PendonorController;