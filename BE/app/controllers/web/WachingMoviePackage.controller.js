const wachingMoviePackageSerivce = require('../../services/WacthingMoviePackage.service');
const ApiError = require('../../api-error');
const {
    MoviePackageBenefit,
    UserModel,
    BillModel,
    WachingMoviePackage,
} = require('../../models');

const moment = require('moment');
const config = require('../../config');
const user_has_waching_package = require('../../models/User_has_waching_package.model');
const { Op } = require('sequelize');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            '+'
        );
    }
    return sorted;
}

function formattedDate(originalDate) {
    return originalDate.replace(
        /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,
        '$1-$2-$3 $4:$5:$6'
    );
}

class WachingMoviePackageController {
    constructor(wachingMoviePackageSerivce) {
        this.wachingMoviePackageSerivce = wachingMoviePackageSerivce;
    }

    getAll = async (req, res, next) => {
        try {
            const wachingMoviePackages =
                await this.wachingMoviePackageSerivce.getAll({
                    include: [
                        {
                            model: MoviePackageBenefit,
                            attributes: ['id', 'name'],
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                });
            return res.json({ wachingMoviePackages });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    createVnpayPayment = async (req, res, next) => {
        try {
            const user = req.user;

            const userModel = await UserModel.findOne({
                where: {
                    id: user.id,
                },
                include: [
                    {
                        model: WachingMoviePackage,
                        through: {
                            where: {
                                expired_at: {
                                    [Op.gt]: new Date(), // Điều kiện: expired_at > ngày hiện tại
                                },
                            },
                            attributes: ['expired_at'],
                        },
                    },
                ],
            });

            console.log(userModel);

            let bankCode = req.body.bankCode ?? '';
            let packageId = req.body.packageId;

            const packageModel = await this.wachingMoviePackageSerivce.getById(
                packageId
            );

            if (userModel.waching_movie_packages.length > 0) {
                const isUserByThisPackage =
                    userModel.waching_movie_packages.some(
                        (pkg) => pkg.id === packageModel.id
                    );
                if (isUserByThisPackage) {
                    const reactPageUrl = `${
                        config.client
                    }/?message=${encodeURIComponent(
                        'Bạn đã mua gói này rồi'
                    )}&type=error`;
                    return res.redirect(reactPageUrl);
                }
                const isUserBuyHigherLevelPackage =
                    userModel.waching_movie_packages.some(
                        (pkg) => pkg.expiresIn > packageModel.expiresIn
                    );
                if (isUserBuyHigherLevelPackage) {
                    const reactPageUrl = `${
                        config.client
                    }/?message=${encodeURIComponent(
                        'Bạn đã mua gói giá trị hơn rồi'
                    )}&type=error`;
                    return res.redirect(reactPageUrl);
                }
            }

            process.env.TZ = 'Asia/Ho_Chi_Minh';

            let date = new Date();
            let createDate = moment(date).format('YYYYMMDDHHmmss');

            let ipAddr =
                req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress;

            let amount =
                packageModel.price * ((100 - packageModel.discount) / 100);

            let tmnCode = config.vnPay.TmnCode;
            let secretKey = config.vnPay.HashSecret;
            let vnpUrl = config.vnPay.url;
            let returnUrl = config.vnPay.returnUrl(user?.id, packageModel.id);
            let billId = moment(date).format('DDHHmmss');

            let locale = req.body.language ?? '';
            if (locale === null || locale === '') {
                locale = 'vn';
            }
            let currCode = 'VND';
            let vnp_Params = {};
            vnp_Params['vnp_Version'] = '2.1.0';
            vnp_Params['vnp_Command'] = 'pay';
            vnp_Params['vnp_TmnCode'] = tmnCode;
            vnp_Params['vnp_Locale'] = locale;
            vnp_Params['vnp_CurrCode'] = currCode;
            vnp_Params['vnp_TxnRef'] = billId;
            vnp_Params['vnp_OrderInfo'] = `Thanh toan goi ${packageModel.name}`;
            vnp_Params['vnp_OrderType'] = 'other';
            vnp_Params['vnp_Amount'] = amount * 100;
            vnp_Params['vnp_ReturnUrl'] = returnUrl;
            vnp_Params['vnp_IpAddr'] = ipAddr;
            vnp_Params['vnp_CreateDate'] = createDate;
            if (bankCode !== null && bankCode !== '') {
                vnp_Params['vnp_BankCode'] = bankCode;
            }
            console.log(vnp_Params);

            vnp_Params = sortObject(vnp_Params);

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require('crypto');
            let hmac = crypto.createHmac('sha512', secretKey);
            let signed = hmac
                .update(new Buffer(signData, 'utf-8'))
                .digest('hex');
            vnp_Params['vnp_SecureHash'] = signed;
            vnpUrl +=
                '?' + querystring.stringify(vnp_Params, { encode: false });
            res.redirect(vnpUrl);
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    handleReturnPayment = async (req, res, next) => {
        try {
            let vnp_Params = req.query;
            let { userId, packageId } = req.params;

            let secureHash = vnp_Params['vnp_SecureHash'];

            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];

            vnp_Params = sortObject(vnp_Params);

            let tmnCode = config.vnPay.TmnCode;
            let secretKey = config.vnPay.HashSecret;

            let querystring = require('qs');
            let signData = querystring.stringify(vnp_Params, { encode: false });
            let crypto = require('crypto');
            let hmac = crypto.createHmac('sha512', secretKey);
            let signed = hmac
                .update(new Buffer(signData, 'utf-8'))
                .digest('hex');

            if (secureHash === signed) {
                //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
                const packageModel = await WachingMoviePackage.findOne({
                    where: {
                        id: packageId,
                    },
                });

                let currentDate = new Date();

                currentDate.setMonth(
                    currentDate.getMonth() + packageModel.expiresIn
                );

                // Lấy ngày tiếp theo
                let nextDate = new Date(currentDate);
                nextDate.setDate(nextDate.getDate() + 1);

                // Định dạng ngày thành chuỗi TIMESTAMP phù hợp MySQL
                const formattedNextDate = nextDate
                    .toISOString()
                    .slice(0, 19)
                    .replace('T', ' ');

                await user_has_waching_package.upsert({
                    user_id: userId,
                    waching_movie_package_id: packageId,
                    expired_at: formattedNextDate,
                });

                const bill = {
                    id: vnp_Params['vnp_TxnRef'],
                    infor: vnp_Params['vnp_OrderInfo']?.replace(/\+/g, ' '),
                    amount: vnp_Params['vnp_Amount'] / 100,
                    bank_tran_no: vnp_Params['vnp_BankTranNo'],
                    card_type: vnp_Params['vnp_CardType'],
                    bank_code: vnp_Params['vnp_BankCode'],
                    pay_date: formattedDate(vnp_Params['vnp_PayDate']),
                    type:
                        vnp_Params['vnp_TransactionStatus'] == '00'
                            ? 'success'
                            : 'fail',
                    user_id: userId,
                };

                await BillModel.create(bill);

                const reactPageUrl = `${
                    config.client
                }/?message=${encodeURIComponent(
                    'Đăng ký gói thành công'
                )}&type=success`;
                return res.redirect(reactPageUrl);
            } else {
                const reactPageUrl = `${
                    config.client
                }/?message=${encodeURIComponent(
                    'Đăng ký gói thất bại'
                )}&type=error`;
                return res.redirect(reactPageUrl);
            }
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new WachingMoviePackageController(wachingMoviePackageSerivce);
