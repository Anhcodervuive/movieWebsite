import config from '@/config';
import createApiClient from '../api.service.js';

class TagService {
    constructor(baseUrl = `${config.apiServer}/api/tag`) {
        this.api = createApiClient(baseUrl);
    }

    async getRecommenededTag() {
        return (await this.api.get('/recommended-tags')).data;
    }

    async findTag(codition) {
        console.log(codition);

        return (
            await this.api.get('/find', {
                params: {
                    ...codition,
                },
            })
        ).data;
    }
}

const api = new TagService();

export default api;
