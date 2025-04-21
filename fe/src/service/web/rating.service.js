import config from '@/config';
import createApiClient from '../api.service.js';

class RatingService {
    constructor(baseUrl = `${config.apiServer}/api/phim`) {
        this.api = createApiClient(baseUrl);
    }

    async getRate(movieId) {
        return (await this.api.get(`/get-rate/${movieId}`)).data;
    }

    async getRateOfUser(movieId) {
        return (
            await this.api.get(`/get-rate-of-user/${movieId}`, {
                withCredentials: true,
            })
        ).data;
    }

    async rateMovie(data) {
        return (
            await this.api.post('/rate-movie', data, {
                withCredentials: true,
            })
        ).data;
    }
}

const api = new RatingService();

export default api;
