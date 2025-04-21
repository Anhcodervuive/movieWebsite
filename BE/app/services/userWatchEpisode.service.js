const { UserWatchEpisode } = require('../models');

class UserWatchEpisodeSerivce {
    constructor(userWatchEpisodeModel) {
        this.userWatchEpisode = userWatchEpisodeModel;
    }

    async createOrUpdateWatchedTime(userId, episodeId, currentTime) {
        const userWatchEpisode = await this.userWatchEpisode.findOne({
            where: {
                user_id: userId,
                episode_id: episodeId,
            },
        });
        if (userWatchEpisode) {
            return await userWatchEpisode.update({
                current_time: currentTime,
            });
        } else {
            return await this.userWatchEpisode.create({
                user_id: userId,
                episode_id: episodeId,
                current_time: currentTime,
            });
        }
    }
}

module.exports = new UserWatchEpisodeSerivce(UserWatchEpisode);
