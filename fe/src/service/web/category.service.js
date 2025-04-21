import config from '@/config';
import createApiClient from '../api.service.js';

class CategoryService {
    constructor(baseUrl = `${config.apiServer}/api/category`) {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (await this.api.get('/')).data;
    }
}

const api = new CategoryService();

export default api;
