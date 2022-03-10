'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const bank_data = global.app.orm.sequelize.define('bank_data',
                    lodash.extend({}, global.app.orm.mixins.attributes, {
                        
    id: {
      autoIncrement: true,
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bank_account_type: {
      type: global.app.orm.Sequelize.ENUM("mlc","cup"),
      allowNull: false,
      defaultValue: "cup"
    },
    bank_name: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: false
    },
    office: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: false
    },
    direction: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: false
    },
    personId: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'person',
        key: 'id'
      }
    },
    mipyme_id: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'mipyme',
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
            tableName: 'bank_data',
            hooks: {}
        });
        bank_data.associate = function() {
            var models = global.app.orm.sequelize.models;
                    models.bank_data.belongsTo(models.person, { foreignKey: 'personId', as: 'person' });
                    models.bank_data.belongsTo(models.mipyme, { foreignKey: 'mipyme_id', as: 'mipyme' });
                    }
                };
                exports.arrayRelations = [
                    {
                    typeRelation:'belongsTo',
                    nameModel:'person',
                    nameRelation:'person'
                },
                    {
                    typeRelation:'belongsTo',
                    nameModel:'mipyme',
                    nameRelation:'mipyme'
                },
        ]
    
    exports.arrayAttributes = ['id','bank_account_type','bank_name','office','direction','personId','mipyme_id','description','createdAt','updatedAt','deletedAt']