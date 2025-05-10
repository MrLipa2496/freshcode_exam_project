module.exports = (sequelize, DataTypes) => {
  const Catalogs = sequelize.define(
    'Catalogs',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      catalog_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'Catalogs',
      timestamps: false,
    }
  );

  return Catalogs;
};
