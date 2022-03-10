'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const country = global.app.orm.sequelize.define('country',
                    lodash.extend({}, global.app.orm.mixins.attributes, {
                        
    id: {
      autoIncrement: true,
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    name: {
      type: global.app.orm.Sequelize.STRING(255),
      allowNull: false
    },
    alpha2: {
      type: global.app.orm.Sequelize.STRING(255),
      allowNull: true
    },
    alpha3: {
      type: global.app.orm.Sequelize.STRING(255),
      allowNull: true
    },
    status: {
      type: global.app.orm.Sequelize.STRING(255),
      allowNull: true
    },
    ioc: {
      type: global.app.orm.Sequelize.STRING(255),
      allowNull: true
    },
    iva: {
      type: global.app.orm.Sequelize.REAL,
      allowNull: true
    }
  ,
    createdAt: {
      type: global.app.orm.Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: global.app.orm.Sequelize.DATE,
      allowNull: false
    },
    deletedAt: {
      type: global.app.orm.Sequelize.DATE,
      allowNull: true
    }
        }), {
            timestamps: true,
            comment: 'A example model.',
            freezeTableName: true,
            tableName: 'country',
            hooks: {}
        });
        country.associate = function() {
            var models = global.app.orm.sequelize.models;
                                    models.country.hasMany(models.mipyme, { foreignKey: 'country_id', as: 'mipymes' });
                                    models.country.hasMany(models.person, { foreignKey: 'countryId', as: 'persons' });
                                    models.country.hasMany(models.state, { foreignKey: 'country_id', as: 'states' });
                    }
                };
                exports.arrayRelations = [
                    {
                    typeRelation:'hasMany',
                    nameModel:'mipyme',
                    nameRelation:'mipymes'
                },
                    {
                    typeRelation:'hasMany',
                    nameModel:'person',
                    nameRelation:'persons'
                },
                    {
                    typeRelation:'hasMany',
                    nameModel:'state',
                    nameRelation:'states'
                },
        ]
    
    exports.arrayAttributes = ['id','description','name','alpha2','alpha3','status','ioc','iva','createdAt','updatedAt','deletedAt']