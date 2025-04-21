import config from '@/config';
import createApiClient from '../api.service.js';

class PermissionService {
    constructor(baseUrl = `${config.apiServer}/api/admin/permission`) {
        this.api = createApiClient(baseUrl);
    }

    async getAll() {
        return (
            await this.api.get('/', {
                withCredentials: true,
            })
        ).data;
    }
}

const api = new PermissionService();

export default api;
