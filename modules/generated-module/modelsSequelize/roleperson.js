const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('roleperson', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    personId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'person',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'roleperson',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "_copy_4",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "personId",
        fields: [
          { name: "personId" },
        ]
      },
      {
        name: "roleId_copy_2",
        fields: [
          { name: "roleId" },
        ]
      },
    ]
  });
};
