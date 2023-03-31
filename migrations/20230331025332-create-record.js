'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      year: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      week: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      learned_minutes: {
        defaultValue: 0,
        type: Sequelize.INTEGER,
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
    await queryInterface.addIndex('Records', ['user_id'])
    await queryInterface.addIndex('Records', ['year', 'week', 'learned_minutes'])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Records')
  }
}