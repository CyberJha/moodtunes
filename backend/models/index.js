const { sequelize, connectDB } = require('../config/database');

const User = require('./User');
const Song = require('./Song');
const Favorite = require('./Favorite');
const History = require('./History');

// Setup Associations
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

Song.hasMany(Favorite, { foreignKey: 'songId', as: 'favoritedBy' });
Favorite.belongsTo(Song, { foreignKey: 'songId' });

User.hasMany(History, { foreignKey: 'userId', as: 'history' });
History.belongsTo(User, { foreignKey: 'userId' });

Song.hasMany(History, { foreignKey: 'songId', as: 'playedIn' });
History.belongsTo(Song, { foreignKey: 'songId' });

module.exports = {
  sequelize,
  connectDB,
  User,
  Song,
  Favorite,
  History
};
