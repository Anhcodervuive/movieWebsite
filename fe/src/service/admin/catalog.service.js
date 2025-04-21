import config from '@/config';
import createApiClient from '../api.service.js';

class CatalogService {
    constructor(baseUrl = `${config.apiServer}/api/admin/catalog`) {
        this.api = createApiClient(baseUrl);
    }

    async getCatalog(id) {
        if (!id) return null;
        return (
            await this.api.get(`/${id}`, {
                withCredentials: true,
            })
        ).data;
    }

    async getAll() {
        return (
            await this.api.get('/', {
                withCredentials: true,
            })
        ).data;
    }

    async create(data) {
        return (
            await this.api.post('/', data, {
                withCredentials: true,
            })
        ).data;
    }

    async update(id, data) {
        return (
            await this.api.put(`/${id}`, data, {
                withCredentials: true,
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

const api = new CatalogService();

export default api;
