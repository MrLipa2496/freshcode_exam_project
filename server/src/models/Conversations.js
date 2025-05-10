module.exports = (sequelize, DataTypes) => {
  const Conversations = sequelize.define(
    'Conversations',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'Conversations',
      timestamps: false,
    }
  );

  return Conversations;
};
