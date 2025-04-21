import config from '@/config';
import createApiClient from '../api.service.js';

class BillService {
    constructor(baseUrl = `${config.apiServer}/api/bill`) {
        this.api = createApiClient(baseUrl);
    }

    async getByUserId(userId) {
        return (await this.api.get(`/${userId}`, { withCredentials: true }))
            .data;
    }
}

const api = new BillService();

export default api;
