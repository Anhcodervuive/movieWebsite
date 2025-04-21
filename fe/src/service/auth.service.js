import config from '@/config';
import createApiClient from './api.service.js';

class AuthService {
    constructor(baseUrl = `${config.apiServer}/api`) {
        this.api = createApiClient(baseUrl);
    }

    async login(loginData) {
        return await this.api.post('/dang-nhap', loginData, {
            withCredentials: true,
        });
    }

    async register(registerData) {
        return await this.api.post('/dang-ky', registerData);
    }

    async logout() {
        return await this.api.post(
            '/dang-xuat',
            {},
            {
                withCredentials: true,
            }
        );
    }

    async updateInfor(formData) {
        return (
            await this.api.post('/cap-nhat-thong-tin', formData, {
                withCredentials: true,
            })
        ).data;
    }

    async changePassword(formData) {
        return (
            await this.api.post('/doi-mat-khau', formData, {
                withCredentials: true,
            })
        ).data;
    }
}

const api = new AuthService();

export default api;
