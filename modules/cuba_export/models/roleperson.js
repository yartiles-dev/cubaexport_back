'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const roleperson = global.app.orm.sequelize.define('roleperson',
                    lodash.extend({}, global.app.orm.mixins.attributes, {
                        
    id: {
      autoIncrement: true,
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roleId: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    personId: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'person',
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
            tableName: 'roleperson',
            hooks: {}
        });
        roleperson.associate = function() {
            var models = global.app.orm.sequelize.models;
                    models.roleperson.belongsTo(models.role, { foreignKey: 'roleId', as: 'role' });
                    models.roleperson.belongsTo(models.person, { foreignKey: 'personId', as: 'person' });
                    }
                };
                exports.arrayRelations = [
                    {
                    typeRelation:'belongsTo',
                    nameModel:'role',
                    nameRelation:'role'
                },
                    {
                    typeRelation:'belongsTo',
                    nameModel:'person',
                    nameRelation:'person'
                },
        ]
    
    exports.arrayAttributes = ['id','roleId','personId','createdAt','updatedAt','deletedAt']