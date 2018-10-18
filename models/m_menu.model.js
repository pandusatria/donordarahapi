'use strict';

function model (entity)
{
    this.id_menu      =   entity.id_menu;
    this.nama_menu    =   entity.nama_menu;
    this.id_role      =   entity.id_role;
    this.nama_role    =   entity.nama_role;
}

model.prototype.getData = function()
{
    return {
        id_menu      :   this.id_menu,
        nama_menu    :   this.nama_menu,
        id_role      :   this.id_role,
        nama_role    :   this.nama_role
    };
};

module.exports = model;