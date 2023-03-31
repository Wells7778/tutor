'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    static associate(models) {
      models.Record.belongsTo(models.User)
    }
  }
  Record.init({
    year: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    week: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    learnedMinutes: {
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Record',
    tableName: 'Records',
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ['year', 'week', 'learnedMinutes'] }]
  })
  return Record
}