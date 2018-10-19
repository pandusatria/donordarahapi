'use strict';

const Response = require('../config/response');
const ObjectID = require('mongodb').ObjectID;
const menuModel = require('../models/m_menu.model');

var now = new Date();

const MenuController = {
    GetMenuLoginHandler : (req, res, next) => {
        let id_role = global.user.id_role
        global.dbo.collection('m_role').aggregate(
            {
               $lookup :
               {
                     from : 'm_menu_access',
                     localField : '_id',
                     foreignField : 'id_role',
                     as : 'role_menu_access'
               }
            },
            {
              $unwind : '$role_menu_access'
            },
            {
              $lookup :
               {
                     from : 'm_menu',
                     localField : 'role_menu_access.id_menu',
                     foreignField : '_id',
                     as : 'menu_menu_access'
               }
            },
            {
              $unwind : '$menu_menu_access'
            },
            {
              $match :
              {
                '_id' : ObjectID(id_role) 
              }
            },
            {
                $project :
                {
                    'id_menu' : '$menu_menu_access._id',
                    'nama_menu' : '$menu_menu_access.menu_name',
                    'id_role' : '$_id',
                    'nama_role' : '$role'
                }
            }
        )
        .toArray((err, data) => {
            if(err)
            {
                return next(new Error());
            }

            let modelCollection = data.map((entity) => {
                return new clientModel(entity);
            });

            Response.send(res, 200, modelCollection);
    }
};

module.exports = MenuController;