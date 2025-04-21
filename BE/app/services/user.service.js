const { where, Op } = require('sequelize');

const { UserModel, WachingMoviePackage, RoleModel } = require('../models');
const { hashPassword } = require('../helpers/auth.helper');
const ApiError = require('../api-error');
const user_has_waching_package = require('../models/User_has_waching_package.model');

class UserService {
    constructor(userModel) {
        this.user = userModel;
    }

    async extractData(payload) {
        const user = {
            email: payload.email,
            name: payload.name,
            password: payload.password
                ? await hashPassword(payload.password)
                : null,
            email_verified_at: Date.now(),
        };

        Object.keys(user).forEach((key) => {
            if (!user[key]) delete user[key];
        });

        return user;
    }

    async getUsers(condition = {}) {
        return await this.user.findAll(condition);
    }

    async getById(id) {
        return await this.user.findOne({
            where: { id },
            attributes: ['id', 'name', 'email', 'created_at'],
            include: [
                {
                    model: WachingMoviePackage,
                    attributes: ['id', 'name'],
                    through: {
                        where: {
                            expired_at: {
                                [Op.gt]: new Date(), // Điều kiện: expired_at > ngày hiện tại
                            },
                        },
                        attributes: [],
                        // required: false,
                    },
                },
                {
                    model: RoleModel,
                    attributes: ['id', 'name'],
                    through: {
                        attributes: [],
                    },
                },
            ],
        });
    }

    async create(payload) {
        const user = await this.extractData(payload);
        const { roleIds, wachingMoviePackageIds } = payload;
        const checkUser = await this.user.findOne({
            where: { email: user.email },
        });
        if (checkUser) {
            throw new ApiError(400, 'Email đã tồn tại');
        }

        const newUser = await this.user.create(user);
        if (roleIds) {
            await newUser.addRoles(roleIds);
        }
        for (let index = 0; index < wachingMoviePackageIds?.length; index++) {
            const wachingMoviePackageId = wachingMoviePackageIds[index];
            const wachingMoviePackage = await WachingMoviePackage.findOne({
                where: { id: wachingMoviePackageId },
            });
            let currentDate = new Date();

            currentDate.setMonth(
                currentDate.getMonth() + wachingMoviePackage.expiresIn
            );

            // Lấy ngày tiếp theo
            let nextDate = new Date(currentDate);
            nextDate.setDate(nextDate.getDate() + 1);

            // Định dạng ngày thành chuỗi TIMESTAMP phù hợp MySQL
            const formattedNextDate = nextDate
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            await user_has_waching_package.create({
                expired_at: formattedNextDate,

                user_id: newUser.id,
                waching_movie_package_id: wachingMoviePackage.id,
            });
        }

        return newUser;
    }

    async update(id, payload) {
        const user = await this.extractData(payload);
        const { roleIds, wachingMoviePackageIds } = payload;

        const checkUser = await this.user.findOne({
            where: { id },
        });
        if (!checkUser) {
            throw new ApiError(400, 'Người dùng không tồn tại');
        }

        const updatedUser = await this.user.update(user, {
            where: { id },
        });

        if (roleIds) {
            await checkUser.setRoles(roleIds);
        }
        if (wachingMoviePackageIds) {
            console.log(wachingMoviePackageIds);

            await checkUser.setWaching_movie_packages(wachingMoviePackageIds);

            for (
                let index = 0;
                index < wachingMoviePackageIds.length;
                index++
            ) {
                const wachingMoviePackageId = wachingMoviePackageIds[index];
                const wachingMoviePackage = await WachingMoviePackage.findOne({
                    where: { id: wachingMoviePackageId },
                });
                let currentDate = new Date();

                currentDate.setMonth(
                    currentDate.getMonth() + wachingMoviePackage.expiresIn
                );

                // Lấy ngày tiếp theo
                let nextDate = new Date(currentDate);
                nextDate.setDate(nextDate.getDate() + 1);

                // Định dạng ngày thành chuỗi TIMESTAMP phù hợp MySQL
                const formattedNextDate = nextDate
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' ');

                await user_has_waching_package.update(
                    {
                        expired_at: formattedNextDate,
                    },
                    {
                        where: {
                            user_id: checkUser.id,
                            waching_movie_package_id: wachingMoviePackage.id,
                        },
                    }
                );
            }
        }

        return updatedUser;
    }

    async delete(id) {
        const checkUser = await this.user.findOne({
            where: { id },
        });
        if (!checkUser) {
            throw new ApiError(400, 'Người dùng không tồn tại');
        }

        return await this.user.destroy({
            where: { id },
        });
    }
}

module.exports = new UserService(UserModel);
