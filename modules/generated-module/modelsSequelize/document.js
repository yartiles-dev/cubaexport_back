const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('document', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    directory: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    url: {
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
    tableName: 'document',
    schema: 'public',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "Ref503",
        fields: [
          { name: "personId" },
        ]
      },
      {
        name: "Ref504",
        fields: [
          { name: "mipyme_id" },
        ]
      },
      {
        name: "document_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
