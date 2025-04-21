import config from '@/config';
import createApiClient from '../api.service.js';

class BillService {
    constructor(baseUrl = `${config.apiServer}/api/admin/bill`) {
        this.api = createApiClient(baseUrl);
    }

    async getAll(query) {
        return (
            await this.api.get('/', {
                withCredentials: true,
                params: {
                    ...query,
                },
            })
        ).data;
    }

    async delete(id) {
        return (
            await this.api.delete(`/${id}`, {
                withCredentials: true,
            })
        ).data;
    }
}

const api = new BillService();

export default api;
