'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('customers', [
      {
        customer_id: 1,
        name: 'Lucas Bitencourt'
      },
      {
        customer_id: 2,
        name: 'João Silva'
      },
      {
        customer_id: 3,
        name: 'Maria Souza'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};
