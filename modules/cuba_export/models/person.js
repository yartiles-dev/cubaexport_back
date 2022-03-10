'use strict';

            var lodash = require('lodash');
            var bcrypt = require('bcryptjs');
            
            exports.loadModel = function loadModel() {
                const person = global.app.orm.sequelize.define('person',
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
      allowNull: true
    },
    birthDate: {
      type: global.app.orm.Sequelize.DATEONLY,
      allowNull: true
    },
    age: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: true
    },
    gender: {
      type: global.app.orm.Sequelize.STRING(255),
      allowNull: true
    },
    photo: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    username: {
      type: global.app.orm.Sequelize.STRING(250),
      allowNull: true
    },
    
                    password: {
                        set: function(password) {
                            var rounds = 8;
                            var hashedPassword = bcrypt.hashSync(password, rounds);
                            this.setDataValue('password', hashedPassword);
                        },
      type: global.app.orm.Sequelize.TEXT,
      allowNull: false
    },
    
                    email: {
                        validate: {
                            isEmail: true
                        },
      type: global.app.orm.Sequelize.STRING(255),
      allowNull: false
    },
    countryId: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 53,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    personalIdentification: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    hasWasSignedFacebook: {
      type: global.app.orm.Sequelize.SMALLINT,
      allowNull: true
    },
    hasSignedGoogle: {
      type: global.app.orm.Sequelize.SMALLINT,
      allowNull: true
    },
    lastLogin: {
      type: global.app.orm.Sequelize.DATE,
      allowNull: true
    },
    lastLogout: {
      type: global.app.orm.Sequelize.DATE,
      allowNull: true
    },
    roleId: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    confirmCode: {
      type: global.app.orm.Sequelize.STRING(255),
      allowNull: false
    },
    ci: {
      type: global.app.orm.Sequelize.BIGINT,
      allowNull: false,
      unique: "ci_UNIQUE"
    },
    volume: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false
    },
    folio: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: false
    },
    nit_code: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    mobile: {
      type: global.app.orm.Sequelize.BIGINT,
      allowNull: true
    },
    phone: {
      type: global.app.orm.Sequelize.BIGINT,
      allowNull: true
    },
    license_number: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    authorized_activity: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: global.app.orm.Sequelize.ENUM("enabled","disabled","complete","pendingSignUpVerification"),
      allowNull: false,
      defaultValue: "disabled"
    },
    mipyme_id: {
      type: global.app.orm.Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'mipyme',
        key: 'id'
      }
    },
    prefix_mobile: {
      type: global.app.orm.Sequelize.TEXT,
      allowNull: true
    },
    is_agent: {
      type: global.app.orm.Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    exist: {
      type: global.app.orm.Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true
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
            tableName: 'person',
            hooks: {}
        });
        person.associate = function() {
            var models = global.app.orm.sequelize.models;
                    models.person.belongsTo(models.country, { foreignKey: 'countryId', as: 'country' });
                    models.person.belongsTo(models.role, { foreignKey: 'roleId', as: 'role' });
                    models.person.belongsTo(models.mipyme, { foreignKey: 'mipyme_id', as: 'mipyme' });
                                    models.person.hasMany(models.bank_data, { foreignKey: 'personId', as: 'bank_datas' });
                                    models.person.hasMany(models.document, { foreignKey: 'personId', as: 'documents' });
                                    models.person.hasMany(models.roleperson, { foreignKey: 'personId', as: 'rolepersons' });
                    }
                    person.prototype.isValidPassword = function(password) {
                        var hashedPassword = this.get('password', {
                            role: 'auth'
                        });
                        return bcrypt.compareSync(password, hashedPassword);
                    }
                };
                exports.arrayRelations = [
                    {
                    typeRelation:'belongsTo',
                    nameModel:'country',
                    nameRelation:'country'
                },
                    {
                    typeRelation:'belongsTo',
                    nameModel:'role',
                    nameRelation:'role'
                },
                    {
                    typeRelation:'belongsTo',
                    nameModel:'mipyme',
                    nameRelation:'mipyme'
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
                    nameModel:'roleperson',
                    nameRelation:'rolepersons'
                },
        ]
    
    exports.arrayAttributes = ['id','description','name','birthDate','age','gender','photo','username','password','email','countryId','personalIdentification','hasWasSignedFacebook','hasSignedGoogle','lastLogin','lastLogout','roleId','confirmCode','ci','volume','folio','nit_code','mobile','phone','license_number','authorized_activity','status','mipyme_id','prefix_mobile','is_agent','exist','createdAt','updatedAt','deletedAt']