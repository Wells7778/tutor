'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      google_id: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      tutor_courses_count: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      score: {
        defaultValue: 0,
        type: Sequelize.DECIMAL(10, 1),
      },
      total_minutes: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
      },
      country: {
        type: Sequelize.STRING,
      },
      is_teacher: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      is_admin: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
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
    await queryInterface.addIndex('Users', ['total_minutes'])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  }
}