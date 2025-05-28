'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CatalogChats', {
      catalog_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Catalogs',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      conversation_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Conversations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
    });

    await queryInterface.addConstraint('CatalogChats', {
      fields: ['catalog_id', 'conversation_id'],
      type: 'primary key',
      name: 'pk_catalog_chats',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CatalogChats');
  },
};
