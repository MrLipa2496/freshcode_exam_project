module.exports = (sequelize, DataTypes) => {
  const CatalogChats = sequelize.define(
    'CatalogChats',
    {
      catalog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Catalogs',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
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
    },
    {
      tableName: 'CatalogChats',
      timestamps: false,
      primaryKey: ['catalog_id', 'conversation_id'],
    }
  );

  return CatalogChats;
};
