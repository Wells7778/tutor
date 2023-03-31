'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tutor extends Model {
    static associate(models) {
      models.Tutor.belongsTo(models.User)
      models.Tutor.hasMany(models.Course)
    }
  }
  Tutor.init({
    introduction: DataTypes.TEXT,
    teachingStyle: DataTypes.TEXT,
    duration: DataTypes.INTEGER,
    link: DataTypes.STRING,
    serviceAvailability: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'Tutor',
    tableName: 'Tutors',
    timestamps: true,
    underscored: true,
  })
  return Tutor
}