const { Model, DataTypes } = require('sequelize');

const MySQL = require('../utils/mysql.util');
const { default: slugify } = require('slugify');

const sequelize = MySQL.connect();

class bills extends Model {}

bills.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        infor: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bank_tran_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bank_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pay_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('success', 'fail'),
            allowNull: false,
        },
        card_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.BIGINT,
            references: {
                model: 'users',
                key: 'id',
            },
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'bills',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        timestamps: true,
        deletedAt: 'deleted_at',
        paranoid: true,
    }
);

module.exports = bills;
