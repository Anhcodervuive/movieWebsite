const billService = require('../../services/bill.service');
const ApiError = require('../../api-error');
const { where, Op } = require('sequelize');

class BillController {
    constructor(billService) {
        this.billService = billService;
    }

    getAll = async (req, res, next) => {
        try {
            const bills = await this.billService.getAll();
            return res.json({ bills });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    delete = async (req, res, next) => {
        try {
            const { id } = req.params;
            await this.billService.delete(id);
            return res.json({
                type: 'success',
                message: 'Xóa hóa đơn thành công',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new BillController(billService);
