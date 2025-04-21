import config from '@/config';
import createApiClient from '../api.service.js';

class WatchingMoviePackageService {
    constructor(
        baseUrl = `${config.apiServer}/api/admin/waching-Movie-Package`
    ) {
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

    async enable(id) {
        return (
            await this.api.put(
                `/enable/${id}`,
                {},
                {
                    withCredentials: true,
                }
            )
        ).data;
    }

    async disable(id) {
        return (
            await this.api.put(
                `/disable/${id}`,
                {},
                {
                    withCredentials: true,
                }
            )
        ).data;
    }
}

const api = new WatchingMoviePackageService();

export default api;
