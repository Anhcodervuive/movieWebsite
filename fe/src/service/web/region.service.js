import config from '@/config';
import createApiClient from '../api.service.js';

class RegionService {
    constructor(baseUrl = `${config.apiServer}/api/region`) {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get('/')).data;
    }
}

const api = new RegionService();

export default api;
