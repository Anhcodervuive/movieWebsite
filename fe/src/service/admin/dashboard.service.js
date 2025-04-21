import config from '@/config';
import createApiClient from '../api.service.js';

class DashBoardService {
    constructor(baseUrl = `${config.apiServer}/api/admin/`) {
        this.api = createApiClient(baseUrl);
    }

    async getTotalViewOfDayWeekMonthAll() {
        return (
            await this.api.get('/phim/total-view-of-day-week-month', {
                withCredentials: true,
            })
        ).data;
    }

    async getTopRateMovies() {
        return (
            await this.api.get('/phim/top-rate', {
                withCredentials: true,
            })
        ).data;
    }

    async getTopViewMovie(type) {
        return (
            await this.api.get('/phim/top-view', {
                withCredentials: true,
                params: {
                    type,
                },
            })
        ).data;
    }

    async getTopViewCategory(type) {
        return (
            await this.api.get('/category/top-view', {
                withCredentials: true,
                params: {
                    type,
                },
            })
        ).data;
    }

    async getQuantityVipAndNonVipUser() {
        return (
            await this.api.get('/user/get-quantity-vip-non-vip-user', {
                withCredentials: true,
            })
        ).data;
    }
}

const api = new DashBoardService();

export default api;
