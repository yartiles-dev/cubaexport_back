const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roleserverfunction', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    serverFunctionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'serverfunction',
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    canAll: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'roleserverfunction',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "_copy_3",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "roleId_copy_1",
        fields: [
          { name: "roleId" },
        ]
      },
      {
        name: "serverFunctionId_copy_1",
        fields: [
          { name: "serverFunctionId" },
        ]
      },
    ]
  });
};
