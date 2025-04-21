import config from '@/config';
import createApiClient from '../api.service.js';

class VideoService {
    constructor(baseUrl = `${config.apiServer}/api/admin/video`) {
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
        const formData = new FormData();
        const { videoFile, type, name } = data;

        formData.append('name', name);
        formData.append('videoFile', videoFile);
        formData.append('type', type);
        return (
            await this.api.post('/', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
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

const api = new VideoService();

export default api;
