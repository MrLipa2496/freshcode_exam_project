'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ConversationParticipants', {
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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      blacklisted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      favorited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });

    await queryInterface.addConstraint('ConversationParticipants', {
      fields: ['conversation_id', 'user_id'],
      type: 'primary key',
      name: 'pk_conversation_participants',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ConversationParticipants');
  },
};
