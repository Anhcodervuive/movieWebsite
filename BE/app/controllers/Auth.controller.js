const jwt = require('jsonwebtoken');

const config = require('../config');
const ApiError = require('../api-error');
const AuthService = require('../services/auth.service');
const RoleService = require('../services/role.service');
const { comparePassword } = require('../helpers/auth.helper');
const { transporter } = require('../helpers/mailer.helper');
const redis = require('../utils/redis.util');
const { Op } = require('sequelize');

class AuthController {
    constructor(authService, roleService) {
        this.authService = authService;
        this.roleService = roleService;
    }

    register = async (req, res, next) => {
        try {
            const user = await this.authService.register(req.body);

            var token = jwt.sign(
                {
                    id: user.id,
                },
                config.token.secretJWTKey,
                { expiresIn: parseInt(config.token.exp) }
            );

            let mailOptions = {
                from: config.mail.username,
                to: user.email,
                subject: 'Xác nhận tài khoản',
                html: `Bấm vào link này để xác nhận tạo tài khoản: <a href="${
                    'http://localhost:' +
                    config.app.port +
                    '/api/verify-email?token=' +
                    token
                }">Xác nhận</a>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return next(new ApiError(error));
                }
            });

            return res.status(201).json({
                id: user.id,
                name: user.name,
                message: 'Vui lòng kiểm tra mail để xác nhận tài khoản',
            });
        } catch (error) {
            return next(new ApiError(400, error.message));
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password, isRemember } = req.body;
            const user = await this.authService.findByEmail(email);
            const watchingMoviePackages = await user.getWaching_movie_packages({
                through: {
                    where: {
                        expired_at: {
                            [Op.gt]: new Date(), // Điều kiện: expired_at > ngày hiện tại
                        },
                    },
                    attributes: ['expired_at'],
                },
            });
            let refresh_token;

            if (!user) {
                throw new ApiError(404, 'Không tìm thấy người dùng');
            }

            if (!user.email_verified_at) {
                throw new ApiError(
                    400,
                    'Xin hãy xác thực thông qua email trước'
                );
            }

            const isMatch = await comparePassword(password, user.password);

            if (!isMatch) {
                throw new ApiError(400, 'Mật khẩu không đúng');
            }

            if (isRemember) {
                refresh_token = jwt.sign(
                    {
                        id: user.id,
                    },
                    config.token.secretJWTRefreshKey,
                    { expiresIn: parseInt(config.token.refreshExp) }
                );

                user.remember_token = refresh_token;
                await user.save();
            }

            const role = await this.roleService.getRoleByUser(user);

            var token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                },
                config.token.secretJWTKey,
                { expiresIn: parseInt(config.token.exp) }
            );

            // Xóa bất kỳ cookie nào với đường dẫn /api nếu có
            res.clearCookie('token', { path: '/api' });

            // Thiết lập cookie với đường dẫn /
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: config.token.exp * 1000, // 2 giờ
                path: '/', // Đảm bảo đường dẫn là /
                sameSite: 'Lax',
            });

            if (refresh_token)
                res.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: config.token.refreshExp * 1000, // 2 giờ
                    path: '/', // Đảm bảo đường dẫn là /
                    sameSite: 'Strict',
                });

            return (
                res
                    // .setHeader(
                    //     'Set-Cookie',
                    //     `token=${token}; HttpOnly; Max-Age=7200; Path=/; SameSite=Lax;`
                    // )
                    .status(200)
                    .json({
                        message: 'login success',
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            joinAt: user.created_at,
                            role,
                            watchingMoviePackages,
                        },
                    })
            );
        } catch (error) {
            return next(error);
        }
    };

    setAccessToken = async (req, res, next) => {
        try {
            const refresh_token = req.cookies.refresh_token;

            const user = await this.authService.findByToken(refresh_token);

            if (!user) throw new Error('Refresh token không tồn tại');

            const role = await this.roleService.getRoleByUser(user);
            jwt.verify(
                refresh_token,
                config.token.secretJWTRefreshKey,
                async (err, decoded) => {
                    if (err) {
                        user.remember_token = null;
                        user.save();
                        throw new Error('Refresh token đã hết hạn');
                    }

                    // Tạo access token mới
                    const newAccessToken = jwt.sign(
                        { id: user.id },
                        config.token.secretJWTKey,
                        { expiresIn: parseInt(config.token.exp) }
                    );

                    res.cookie('token', newAccessToken, {
                        httpOnly: true,
                        maxAge: config.token.exp * 1000, // 2 giờ
                        path: '/', // Đảm bảo đường dẫn là /
                        sameSite: 'Lax',
                    });

                    return res.status(200).json({
                        message: 'Cấp lại access token thành công',
                        user: { name: user.name, role },
                    });
                }
            );
        } catch (error) {
            return next(new ApiError(400, error.message));
        }
    };

    verifyEmail = async (req, res, next) => {
        try {
            const { token } = req.query;

            const decoded = jwt.verify(token, config.token.secretJWTKey);
            if (!decoded) {
                throw new Error({
                    status: 401,
                    message: 'Token không hợp lệ hoặc hết hạn',
                });
            }

            await redis.client.set(
                token,
                'blacklisted',
                'EX',
                parseInt(config.token.exp)
            );

            const user = await this.authService.findById(decoded.id);
            user.email_verified_at = new Date();
            await user.save();

            const reactPageUrl = `${
                config.client
            }/dang-nhap?message=${encodeURIComponent(
                'Xác thực tài khoản thành công'
            )}&type=success`;
            return res.redirect(reactPageUrl);
        } catch (error) {
            return next(new ApiError(error.status, error.message));
        }
    };

    logout = async (req, res, next) => {
        const user = req.user;
        const token = req.cookies.token;
        const refresh_token = req.cookies.refresh_token;

        try {
            if (token) {
                await redis.client.set(
                    token,
                    'blacklisted',
                    'EX',
                    parseInt(config.token.exp)
                );

                res.cookie('token', null, {
                    httpOnly: true,
                    expires: new Date(0),
                    path: '/',
                    sameSite: 'Lax',
                });
            }
            if (refresh_token) {
                await redis.client.set(
                    refresh_token,
                    'blacklisted',
                    'EX',
                    parseInt(config.token.refreshExp)
                );
                await this.authService.removeRemmeberToken(user.id);
                res.cookie('refresh_token', null, {
                    httpOnly: true,
                    expires: new Date(0),
                    path: '/',
                    sameSite: 'Lax',
                });
            }

            return (
                res
                    // .setHeader(
                    //     'Set-Cookie',
                    //     'token=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax;'
                    // )
                    .status(200)
                    .json({
                        type: 'success',
                        message: 'Đăng xuất thành công',
                    })
            );
        } catch (error) {
            return next(new ApiError(400, error.message));
        }
    };

    updateInfor = async (req, res, next) => {
        const user = req.user;
        try {
            await this.authService.update(user.id, req.body);

            return res.json({
                type: 'success',
                message: 'Cập nhật thông tin người dùng thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    changePassword = async (req, res, next) => {
        try {
            const user = req.user;
            const userModel = await this.authService.findById(user.id);
            const { oldPassword, newPassword } = req.body;

            const isMatch = await comparePassword(
                oldPassword,
                userModel.password
            );

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ type: 'error', message: 'mật khẩu cũ không đúng' });
            }

            await this.authService.update(user.id, { password: newPassword });

            return res.json({
                type: 'success',
                message: 'Đổi mật khẩu thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new AuthController(AuthService, RoleService);
