'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const state = global.app.orm.sequelize.define('state',
                    lodash.extend({}, global.app.orm.mixins.attributes, {
                        
    id: {
      autoIncrement: true,
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: false,
      unique: "name_state_UNIQUE"
    },
    description: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    country_id: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'country',
        key: 'id'
      }
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
            tableName: 'state',
            hooks: {}
        });
        state.associate = function() {
            var models = global.app.orm.sequelize.models;
                    models.state.belongsTo(models.country, { foreignKey: 'country_id', as: 'country' });
                                    models.state.hasMany(models.city, { foreignKey: 'state_id', as: 'citys' });
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
                    nameModel:'city',
                    nameRelation:'citys'
                },
        ]
    
    exports.arrayAttributes = ['id','name','description','country_id','createdAt','updatedAt','deletedAt']