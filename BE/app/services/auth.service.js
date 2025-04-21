const { where } = require('sequelize');

const { UserModel } = require('../models');
const { hashPassword } = require('../helpers/auth.helper');
const ApiError = require('../api-error');

class authService {
    constructor(AuthModel) {
        this.auth = AuthModel;
    }

    async extractData(payload) {
        const user = {
            email: payload.email,
            name: payload.name,
            password: payload.password
                ? await hashPassword(payload.password)
                : null,
        };

        Object.keys(user).forEach((key) => {
            if (!user[key]) delete user[key];
        });

        return user;
    }

    async register(payload) {
        const user = await this.extractData(payload);

        const checkUser = await this.findByEmail(user.email);
        if (checkUser) {
            throw new ApiError(400, 'Email đã tồn tại');
        }

        return await this.auth.create(user);
    }

    async findByEmail(email) {
        return await this.auth.findOne({ where: { email } });
    }

    async findById(id) {
        return await this.auth.findByPk(id);
    }

    async findByToken(token) {
        return await this.auth.findOne({ where: { remember_token: token } });
    }

    async removeRemmeberToken(id) {
        return await this.auth.update({ token: null }, { where: { id } });
    }

    async update(id, payload) {
        const authData = await this.extractData(payload);
        console.log(authData, id);

        return await this.auth.update(authData, {
            where: {
                id,
            },
        });
    }
}

module.exports = new authService(UserModel);
