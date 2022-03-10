'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const roleserverfunction = global.app.orm.sequelize.define('roleserverfunction',
                    lodash.extend({}, global.app.orm.mixins.attributes, {
                        
    id: {
      autoIncrement: true,
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    serverFunctionId: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'serverfunction',
        key: 'id'
      }
    },
    roleId: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    canAll: {
      type: global.app.orm.Sequelize.STRING(255),
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
            tableName: 'roleserverfunction',
            hooks: {}
        });
        roleserverfunction.associate = function() {
            var models = global.app.orm.sequelize.models;
                    models.roleserverfunction.belongsTo(models.serverfunction, { foreignKey: 'serverFunctionId', as: 'serverfunction' });
                    models.roleserverfunction.belongsTo(models.role, { foreignKey: 'roleId', as: 'role' });
                    }
                };
                exports.arrayRelations = [
                    {
                    typeRelation:'belongsTo',
                    nameModel:'serverfunction',
                    nameRelation:'serverfunction'
                },
                    {
                    typeRelation:'belongsTo',
                    nameModel:'role',
                    nameRelation:'role'
                },
        ]
    
    exports.arrayAttributes = ['id','serverFunctionId','roleId','canAll','createdAt','updatedAt','deletedAt']