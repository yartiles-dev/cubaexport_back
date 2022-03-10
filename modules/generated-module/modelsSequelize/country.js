const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('country', {
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
      allowNull: false
    },
    alpha2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    alpha3: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ioc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    iva: {
      type: DataTypes.REAL,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'country',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "country_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
