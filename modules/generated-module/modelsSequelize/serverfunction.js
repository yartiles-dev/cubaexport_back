const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('serverfunction', {
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
    route: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    method: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    free: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    associatedModel: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'serverfunction',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "_copy_2",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
