const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('state', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "name_state_UNIQUE"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    country_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'country',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'state',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "Ref600",
        fields: [
          { name: "country_id" },
        ]
      },
      {
        name: "name_state_UNIQUE",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "state_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
