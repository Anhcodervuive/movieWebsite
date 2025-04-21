import config from '@/config';
import createApiClient from '../api.service.js';

class MovieService {
    constructor(baseUrl = `${config.apiServer}/api/phim`) {
        this.api = createApiClient(baseUrl);
    }

    async getRecommenededMovie() {
        return (await this.api.get('/de-xuat')).data;
    }

    // async filterMovieByTag(codition) {
    //     return (
    //         await this.api.get('/tag', {
    //             params: {
    //                 ...codition,
    //             },
    //         })
    //     ).data;
    // }

    async checkPermissionToWatchEps(movieId, episodeSlug) {
        return (
            await this.api.get('/check-permission-to-watch-episode', {
                withCredentials: true,
                params: {
                    movieId,
                    episodeSlug,
                },
            })
        ).data;
    }

    async getFullEpsMovie(movieSlug) {
        return (
            await this.api.get(`/${movieSlug}`, {
                withCredentials: true,
            })
        ).data;
    }

    async getMoviesByCategories(categories, exceptMoiveId) {
        return (
            await this.api.get('/danh-muc', {
                params: {
                    categories,
                    exceptMoiveId,
                },
                withCredentials: true,
            })
        ).data;
    }

    async filter(tag, type, publishedYear, categoryId, regionId) {
        return (
            await this.api.get('/filter', {
                params: {
                    tag,
                    type,
                    publishedYear,
                    categoryId,
                    regionId,
                },
            })
        ).data;
    }

    async updateWatchedTime(episodeId, currentTime) {
        return (
            await this.api.post(
                '/update-watched-time',
                {
                    episodeId,
                    currentTime,
                },
                {
                    withCredentials: true,
                }
            )
        ).data;
    }

    async getHistory() {
        return (await this.api.get('/history', { withCredentials: true })).data;
    }

    async getEpisode(movieId, episodeSlug) {
        return (
            await this.api.get('/episode', {
                withCredentials: true,
                params: { movieId, episodeSlug },
            })
        ).data;
    }

    async removeHistory(movieId) {
        return (
            await this.api.get(`/delete-history/${movieId}`, {
                withCredentials: true,
            })
        ).data;
    }

    async increaseView(movieId) {
        return (await this.api.post('/increase-view', { movieId })).data;
    }
}

const api = new MovieService();

export default api;
