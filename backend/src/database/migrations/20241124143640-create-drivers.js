'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('drivers', {
      driver_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      vehicle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false
      },
      fare: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false
      },
      min_km: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('drivers');
  }
};
