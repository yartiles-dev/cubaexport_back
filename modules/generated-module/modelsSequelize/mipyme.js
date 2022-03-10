const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mipyme', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reeup_code: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: "reeup_code_UNIQUE"
    },
    nit_code: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: "nit_code_UNIQUE"
    },
    license_number: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: "license_number_UNIQUE"
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    direction: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    authorized_activity: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 53,
      references: {
        model: 'country',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mipyme',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "Ref500",
        fields: [
          { name: "country_id" },
        ]
      },
      {
        name: "license_number_UNIQUE",
        unique: true,
        fields: [
          { name: "license_number" },
        ]
      },
      {
        name: "mipyme_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "nit_code_UNIQUE",
        unique: true,
        fields: [
          { name: "nit_code" },
        ]
      },
      {
        name: "reeup_code_UNIQUE",
        unique: true,
        fields: [
          { name: "reeup_code" },
        ]
      },
    ]
  });
};
