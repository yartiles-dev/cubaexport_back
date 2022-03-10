'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const city = global.app.orm.sequelize.define('city',
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
      unique: "name_city_UNIQUE"
    },
    description: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    state_id: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'state',
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
            tableName: 'city',
            hooks: {}
        });
        city.associate = function() {
            var models = global.app.orm.sequelize.models;
                    models.city.belongsTo(models.state, { foreignKey: 'state_id', as: 'state' });
                    }
                };
                exports.arrayRelations = [
                    {
                    typeRelation:'belongsTo',
                    nameModel:'state',
                    nameRelation:'state'
                },
        ]
    
    exports.arrayAttributes = ['id','name','description','state_id','createdAt','updatedAt','deletedAt']