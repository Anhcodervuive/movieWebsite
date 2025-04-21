import config from '@/config';
import createApiClient from '../api.service.js';

class MovieService {
    constructor(baseUrl = `${config.apiServer}/api/admin/phim`) {
        this.api = createApiClient(baseUrl);
    }

    async getById(id) {
        if (!id) return null;
        return (
            await this.api.get(`/${id}`, {
                withCredentials: true,
            })
        ).data;
    }

    async getAll(queryParams) {
        return (
            await this.api.get('/', {
                withCredentials: true,
                params: {
                    ...queryParams,
                },
            })
        ).data;
    }

    async create(data) {
        return (
            await this.api.post('/', data, {
                withCredentials: true,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            })
        ).data;
    }

    async update(id, data) {
        return (
            await this.api.put(`/${id}`, data, {
                withCredentials: true,
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
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

const api = new MovieService();

export default api;
