'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      Course.belongsTo(models.Tutor)
      Course.belongsTo(models.User)
    }
  }
  Course.init({
    status: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    startTime: DataTypes.DATE,
    score: {
      defaultValue: 0,
      type: DataTypes.DECIMAL(10, 1),
    },
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
    tableName: 'Courses',
    timestamps: true,
    underscored: true,
  })
  return Course
}