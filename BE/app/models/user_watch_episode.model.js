const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class UserWatchEpisode extends Model {}

UserWatchEpisode.init(
    {
        current_time: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        episode_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'user_watch_episode',
        tableName: 'user_watch_episode',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
    }
);

module.exports = UserWatchEpisode;
