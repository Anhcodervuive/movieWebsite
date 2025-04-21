const billService = require('../../services/bill.service');
const ApiError = require('../../api-error');
const { where, Op } = require('sequelize');

class BillController {
    constructor(billService) {
        this.billService = billService;
    }

    getByUserId = async (req, res, next) => {
        try {
            const bills = await this.billService.getByUserId(req.params.userId);
            return res.json({ bills });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new BillController(billService);
