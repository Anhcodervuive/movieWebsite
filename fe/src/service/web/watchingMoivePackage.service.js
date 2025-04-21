import config from '@/config';
import createApiClient from '../api.service.js';

class ActorService {
    constructor(baseUrl = `${config.apiServer}/api/waching-movie-package`) {
        this.api = createApiClient(baseUrl);
    }

    async getAll(query) {
        return (
            await this.api.get('/', {
                params: {
                    ...query,
                },
            })
        ).data;
    }
}

const api = new ActorService();

export default api;
