const { where, Op } = require('sequelize');
const { BillModel } = require('../models');
const { generateMD5Hash } = require('../helpers/encrypt.help');

class BillSerivce {
    constructor(billModel) {
        this.bill = billModel;
    }

    async getAll() {
        return await this.bill.findAll({});
    }

    async getByUserId(id) {
        return await this.bill.findAll({
            where: {
                user_id: id,
            },
        });
    }

    async delete(id) {
        return await this.bill.destroy({
            where: {
                id,
            },
        });
    }
}

module.exports = new BillSerivce(BillModel);
