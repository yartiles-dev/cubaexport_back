'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const mipyme = global.app.orm.sequelize.define('mipyme',
                    lodash.extend({}, global.app.orm.mixins.attributes, {
                        
    id: {
      autoIncrement: true,
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reeup_code: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true,
      unique: "reeup_code_UNIQUE"
    },
    nit_code: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true,
      unique: "nit_code_UNIQUE"
    },
    license_number: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true,
      unique: "license_number_UNIQUE"
    },
    name: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    direction: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    authorized_activity: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    country_id: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 53,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    description: {
      type: global.app.orm.Sequelize.TEXT,
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
            tableName: 'mipyme',
            hooks: {}
        });
        mipyme.associate = function() {
            var models = global.app.orm.sequelize.models;
                    models.mipyme.belongsTo(models.country, { foreignKey: 'country_id', as: 'country' });
                                    models.mipyme.hasMany(models.bank_data, { foreignKey: 'mipyme_id', as: 'bank_datas' });
                                    models.mipyme.hasMany(models.document, { foreignKey: 'mipyme_id', as: 'documents' });
                                    models.mipyme.hasMany(models.person, { foreignKey: 'mipyme_id', as: 'persons' });
                    }
                };
                exports.arrayRelations = [
                    {
                    typeRelation:'belongsTo',
                    nameModel:'country',
                    nameRelation:'country'
                },
                    {
                    typeRelation:'hasMany',
                    nameModel:'bank_data',
                    nameRelation:'bank_datas'
                },
                    {
                    typeRelation:'hasMany',
                    nameModel:'document',
                    nameRelation:'documents'
                },
                    {
                    typeRelation:'hasMany',
                    nameModel:'person',
                    nameRelation:'persons'
                },
        ]
    
    exports.arrayAttributes = ['id','reeup_code','nit_code','license_number','name','direction','authorized_activity','country_id','description','createdAt','updatedAt','deletedAt']