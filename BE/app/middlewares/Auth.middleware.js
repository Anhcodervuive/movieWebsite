const jwt = require('jsonwebtoken');

const redis = require('../utils/redis.util');
const ApiError = require('../api-error');
const config = require('../config');

const roleService = require('../services/role.service');

async function checkLoginMiddleware(req, res, next) {
    const token = req.cookies.token;
    const refresh_token = req.cookies.refresh_token;
    console.log('token: ', token, 'refresh token: ', refresh_token);

    try {
        const valueToken = token ? await redis.client.get(token) : null;

        const valueRefreshToken = refresh_token
            ? await redis.client.get(refresh_token)
            : null;

        if (
            valueToken === 'blacklisted' ||
            valueRefreshToken === 'blacklisted'
        ) {
            return next(new ApiError(401, 'Phiên đăng nhập đã đã hết hạn'));
        }

        const decoded = jwt.verify(token, config.token.secretJWTKey);
        console.log(decoded);

        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).send(error.message);
    }
}

async function autoRefreshTokenMiddleware(req, res, next) {
    const token = req.cookies.token;
    const refresh_token = req.cookies.refresh_token;
    console.log('token: ', token, 'refresh token: ', refresh_token);

    try {
        if (!token && refresh_token) {
            return next(
                new ApiError(
                    401,
                    'Token hết hạn, hãy refresh để thực hiện hành động tiếp theo để trải nghiệm được đầy đủ quyền lợi của người đã có tài khoản'
                )
            );
        }

        jwt.verify(token, config.token.secretJWTKey, (err, decoded) => {
            if (err) {
                return next();
            }
            req.user = decoded;
            return next();
        });
    } catch (error) {
        return res.status(400).send(error.message);
    }
}

function isHaveRoles(roles = []) {
    return async (req, res, next) => {
        const user = req.user;

        const userRole = await roleService.getRoleByUserId(user.id);

        const haveRole = userRole
            .map((role) => role.name)
            .some((roleName) => roles.includes(roleName));

        if (haveRole) {
            return next();
        } else {
            return res
                .status(403)
                .send('bạn không đủ quyền hạn để thực hiện hành động này');
        }
    };
}

module.exports = {
    checkLoginMiddleware,
    autoRefreshTokenMiddleware,
    isHaveRoles,
};
