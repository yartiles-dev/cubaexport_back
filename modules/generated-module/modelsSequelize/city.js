const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('city', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "name_city_UNIQUE"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    state_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'state',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'city',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "Ref601",
        fields: [
          { name: "state_id" },
        ]
      },
      {
        name: "city_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "name_city_UNIQUE",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
