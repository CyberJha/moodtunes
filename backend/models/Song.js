const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Song = sequelize.define('Song', {
    id: {
        type: DataTypes.STRING, // Since we get this from iTunes/External APIs
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    album: {
        type: DataTypes.STRING,
    },
    albumArt: {
        type: DataTypes.STRING,
    },
    previewUrl: {
        type: DataTypes.STRING, // 30 sec preview URL
    },
    duration: {
        type: DataTypes.INTEGER, // in milliseconds
    },
    genre: {
        type: DataTypes.STRING
    },
    mood: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

module.exports = Song;
