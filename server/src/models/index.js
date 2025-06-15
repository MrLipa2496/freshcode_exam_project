const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configPath =
  env === 'production'
    ? path.join(__dirname, '..', '..', '..', 'src/server/config/.json')
    : path.join(__dirname, '..', '/config/postgresConfig.js');
const config = require(configPath)[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

db['Contests'].belongsTo(db['Users'], {
  foreignKey: 'userId',
  sourceKey: 'id',
});
db['Contests'].hasMany(db['Offers'], {
  foreignKey: 'contestId',
  targetKey: 'id',
});

db['Users'].hasMany(db['Offers'], { foreignKey: 'userId', targetKey: 'id' });
db['Users'].hasMany(db['Contests'], { foreignKey: 'userId', targetKey: 'id' });
db['Users'].hasMany(db['Ratings'], { foreignKey: 'userId', targetKey: 'id' });

db['Offers'].belongsTo(db['Users'], { foreignKey: 'userId', sourceKey: 'id' });
db['Offers'].belongsTo(db['Contests'], {
  foreignKey: 'contestId',
  sourceKey: 'id',
});
db['Offers'].hasOne(db['Ratings'], { foreignKey: 'offerId', targetKey: 'id' });

db['Ratings'].belongsTo(db['Users'], { foreignKey: 'userId', targetKey: 'id' });
db['Ratings'].belongsTo(db['Offers'], {
  foreignKey: 'offerId',
  targetKey: 'id',
});

db['Users'].hasMany(db['Messages'], {
  foreignKey: 'sender_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db['Users'].belongsToMany(db['Conversations'], {
  through: db['ConversationParticipants'],
  foreignKey: 'user_id',
  otherKey: 'conversation_id',
  as: 'Conversations',
});

db['Users'].hasMany(db['Catalogs'], {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db['Users'].hasMany(db['ConversationParticipants'], {
  foreignKey: 'user_id',
  as: 'UserParticipants',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db['Conversations'].belongsToMany(db['Users'], {
  through: db['ConversationParticipants'],
  foreignKey: 'conversation_id',
  otherKey: 'user_id',
  as: 'Participants',
});

db['Conversations'].hasMany(db['Messages'], {
  foreignKey: 'conversation_id',
  as: 'Messages',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db['Conversations'].belongsToMany(db['Catalogs'], {
  through: db['CatalogChats'],
  foreignKey: 'conversation_id',
  otherKey: 'catalog_id',
  as: 'Catalogs',
});

db['Conversations'].hasMany(db['ConversationParticipants'], {
  foreignKey: 'conversation_id',
  as: 'participants',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db['Messages'].belongsTo(db['Conversations'], {
  foreignKey: 'conversation_id',
  as: 'conversation',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db['Messages'].belongsTo(db['Users'], {
  foreignKey: 'sender_id',
  as: 'Sender',
});

db['Catalogs'].belongsTo(db['Users'], {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db['Catalogs'].belongsToMany(db['Conversations'], {
  through: db['CatalogChats'],
  foreignKey: 'catalog_id',
  otherKey: 'conversation_id',
  as: 'Conversations',
});

db['CatalogChats'].belongsTo(db['Catalogs'], {
  foreignKey: 'catalog_id',
  as: 'Catalog',
});
db['CatalogChats'].belongsTo(db['Conversations'], {
  foreignKey: 'conversation_id',
  as: 'RelatedConversation',
});

db['ConversationParticipants'].belongsTo(db['Conversations'], {
  foreignKey: 'conversation_id',
  as: 'conversation',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db['ConversationParticipants'].belongsTo(db['Users'], {
  foreignKey: 'user_id',
  as: 'User',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
