'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const document = global.app.orm.sequelize.define('document',
                    lodash.extend({}, global.app.orm.mixins.attributes, {
                        
    id: {
      autoIncrement: true,
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: false
    },
    directory: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: false
    },
    url: {
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
            tableName: 'document',
            hooks: {}
        });
        document.associate = function() {
            var models = global.app.orm.sequelize.models;
                    models.document.belongsTo(models.person, { foreignKey: 'personId', as: 'person' });
                    models.document.belongsTo(models.mipyme, { foreignKey: 'mipyme_id', as: 'mipyme' });
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
    
    exports.arrayAttributes = ['id','name','directory','url','personId','mipyme_id','description','createdAt','updatedAt','deletedAt']