'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const log = global.app.orm.sequelize.define('log',
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
    personId: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    serverFunctionId: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'serverfunction',
        key: 'id'
      }
    },
    approverId: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: true
    },
    statusCode: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false
    },
    originIp: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: false
    },
    mac: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    navigator: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    os: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    device: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    token_life_time: {
      type: global.app.orm.Sequelize.DATE,
      allowNull: true
    },
    service_duration: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false
    },
    last_login: {
      type: global.app.orm.Sequelize.DATE,
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
            tableName: 'log',
            hooks: {}
        });
        log.associate = function() {
            var models = global.app.orm.sequelize.models;
                    models.log.belongsTo(models.serverfunction, { foreignKey: 'serverFunctionId', as: 'serverfunction' });
                    }
                };
                exports.arrayRelations = [
                    {
                    typeRelation:'belongsTo',
                    nameModel:'serverfunction',
                    nameRelation:'serverfunction'
                },
        ]
    
    exports.arrayAttributes = ['id','description','personId','serverFunctionId','approverId','statusCode','originIp','mac','navigator','os','device','token_life_time','service_duration','last_login','createdAt','updatedAt','deletedAt']