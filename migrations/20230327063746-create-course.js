'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tutor_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      status: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      start_time: {
        type: Sequelize.DATE,
      },
      score: {
        defaultValue: 0,
        type: Sequelize.DECIMAL(10, 1),
      },
      comment: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })
    await queryInterface.addIndex('Courses', ['tutor_id'])
    await queryInterface.addIndex('Courses', ['user_id'])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses')
  }
}