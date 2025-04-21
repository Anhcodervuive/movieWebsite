import config from '@/config';
import createApiClient from '../api.service.js';

class ActorService {
    constructor(baseUrl = `${config.apiServer}/api/admin/actor`) {
        this.api = createApiClient(baseUrl);
    }

    async getActor(id) {
        if (!id) return null;
        return (
            await this.api.get(`/${id}`, {
                withCredentials: true,
            })
        ).data;
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

const api = new ActorService();

export default api;
