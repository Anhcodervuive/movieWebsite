const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');

const sequelize = MySQL.connect();

class Users extends Model {}

Users.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email_verified_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        remember_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'users',
        modelName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
    }
);

module.exports = Users;
