const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('log', {
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
    personId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    serverFunctionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'serverfunction',
        key: 'id'
      }
    },
    approverId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    statusCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    originIp: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    mac: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    navigator: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    os: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    device: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    token_life_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    service_duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'log',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "_copy_11",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "serverFunctionId",
        fields: [
          { name: "serverFunctionId" },
        ]
      },
    ]
  });
};
