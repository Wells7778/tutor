'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.hasOne(models.Tutor)
      models.User.hasMany(models.Course)
      models.User.hasMany(models.Record)
    }
  }
  User.init({
    googleId: DataTypes.STRING,
    name: DataTypes.STRING,
    email: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    avatar: DataTypes.STRING,
    description: DataTypes.TEXT,
    tutorCoursesCount: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    score: {
      defaultValue: 0,
      type: DataTypes.DECIMAL(10, 1),
    },
    totalMinutes: {
      defaultValue: 0,
      type: DataTypes.INTEGER,
    },
    country: {
      type: DataTypes.STRING,
    },
    isTeacher: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    },
    isAdmin: {
      defaultValue: false,
      type: DataTypes.BOOLEAN,
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true,
    timestamps: true,
    indexes: [{ fields: ['totalMinutes']}]
  })
  return User
}