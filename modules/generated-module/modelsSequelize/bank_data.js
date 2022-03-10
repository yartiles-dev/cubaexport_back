const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bank_data', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bank_account_type: {
      type: DataTypes.ENUM("mlc","cup"),
      allowNull: false,
      defaultValue: "cup"
    },
    bank_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    office: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    direction: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    personId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'person',
        key: 'id'
      }
    },
    mipyme_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'mipyme',
        key: 'id'
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bank_data',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "Ref501",
        fields: [
          { name: "personId" },
        ]
      },
      {
        name: "Ref502",
        fields: [
          { name: "mipyme_id" },
        ]
      },
      {
        name: "bank_data_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
