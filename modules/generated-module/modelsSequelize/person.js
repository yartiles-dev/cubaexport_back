const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('person', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    photo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 53,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    personalIdentification: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hasWasSignedFacebook: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    hasSignedGoogle: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastLogout: {
      type: DataTypes.DATE,
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    confirmCode: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ci: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: "ci_UNIQUE"
    },
    volume: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    folio: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nit_code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    mobile: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    phone: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    license_number: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    authorized_activity: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("enabled","disabled","complete","pendingSignUpVerification"),
      allowNull: false,
      defaultValue: "disabled"
    },
    mipyme_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mipyme',
        key: 'id'
      }
    },
    prefix_mobile: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_agent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    exist: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'person',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "Ref505",
        fields: [
          { name: "mipyme_id" },
        ]
      },
      {
        name: "Ref651",
        fields: [
          { name: "roleId" },
        ]
      },
      {
        name: "Ref917",
        fields: [
          { name: "countryId" },
        ]
      },
      {
        name: "ci_UNIQUE",
        unique: true,
        fields: [
          { name: "ci" },
        ]
      },
      {
        name: "confirmCode_UNIQUE",
        unique: true,
        fields: [
          { name: "confirmCode" },
        ]
      },
      {
        name: "email_UNIQUE",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "person_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "username_UNIQUE",
        unique: true,
        fields: [
          { name: "username" },
        ]
      },
    ]
  });
};
