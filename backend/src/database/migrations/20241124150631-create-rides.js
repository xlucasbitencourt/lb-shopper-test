'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('rides', {
      ride_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      driver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'drivers',
          key: 'driver_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'customer_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      start_lat: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      start_lng: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      end_lat: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      end_lng: {
        type: Sequelize.DECIMAL(10, 7),
        allowNull: false
      },
      distance: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      value: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('rides');
  }
};
