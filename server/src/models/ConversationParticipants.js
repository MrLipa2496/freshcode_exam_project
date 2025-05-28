module.exports = (sequelize, DataTypes) => {
  const ConversationParticipants = sequelize.define(
    'ConversationParticipants',
    {
      conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Conversations',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      favorited: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'ConversationParticipants',
      timestamps: false,
    }
  );

  return ConversationParticipants;
};
