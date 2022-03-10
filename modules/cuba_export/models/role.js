'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const role = global.app.orm.sequelize.define('role',
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
      type: global.app.orm.Sequelize.TEXT,
      allowNull: false,
      unique: "name_UNIQUE"
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
            tableName: 'role',
            hooks: {}
        });
        role.associate = function() {
            var models = global.app.orm.sequelize.models;
                                    models.role.hasMany(models.person, { foreignKey: 'roleId', as: 'persons' });
                                    models.role.hasMany(models.roleperson, { foreignKey: 'roleId', as: 'rolepersons' });
                                    models.role.hasMany(models.roleserverfunction, { foreignKey: 'roleId', as: 'roleserverfunctions' });
                    }
                };
                exports.arrayRelations = [
                    {
                    typeRelation:'hasMany',
                    nameModel:'person',
                    nameRelation:'persons'
                },
                    {
                    typeRelation:'hasMany',
                    nameModel:'roleperson',
                    nameRelation:'rolepersons'
                },
                    {
                    typeRelation:'hasMany',
                    nameModel:'roleserverfunction',
                    nameRelation:'roleserverfunctions'
                },
        ]
    
    exports.arrayAttributes = ['id','description','name','createdAt','updatedAt','deletedAt']