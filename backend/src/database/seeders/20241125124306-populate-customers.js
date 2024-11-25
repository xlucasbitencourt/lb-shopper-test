'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('customers', [
      {
        name: 'Lucas Bitencourt'
      },
      {
        name: 'João Silva'
      },
      {
        name: 'Maria Souza'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('customers', null, {});
  }
};
