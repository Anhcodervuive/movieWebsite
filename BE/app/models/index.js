const UserModel = require('./users.model');
const MovieModel = require('./movie.model');
const RoleModel = require('./roles.model');
const Model_has_roles = require('./model_has_roles.model');
const PermissionModel = require('./permission.model');
const role_has_permissions = require('./role_has_permission.model');
const RegionsModel = require('./region.model');
const Movie_region = require('./movie_region.model');
const TagModel = require('./tag.model');
const movie_tag = require('./movie_tag.model');
const EpisodeModel = require('./episodes.model');
const ActorModel = require('./actor.model');
const Actor_Movie = require('./actor_movie.model');
const DirectorModel = require('./directors.model');
const Director_movie = require('./director_movie.model');
const CategoriesModel = require('./categories.model');
const Category_movie = require('./category_movie.model');
const CatalogModel = require('./catalogs.model');
const content_sections_model = require('./content_sections.model');
const content_section_movie = require('./content_section_movie.model');
const RatingModel = require('./rating.model');
const UserWatchEpisode = require('./user_watch_episode.model');
const WachingMoviePackage = require('./waching_movie_package.model');
const MoviePackageBenefit = require('./movie_package_benefit.model');
const WachingMoviePackageHasBenefit = require('./waching_movie_package_has_benefit.model');
const EpisodeRequiredWachingPackage = require('./episode_required_waching_package.model');
const MovieRequiredWachingPackage = require('./movie_required_waching_package.model');
const waching_movie_package = require('./waching_movie_package.model');
const BillModel = require('./bills.model');
const UserHasWachingPackage = require('./User_has_waching_package.model');

UserModel.belongsToMany(RoleModel, {
    through: Model_has_roles,
    foreignKey: 'model_id',
});
RoleModel.belongsToMany(UserModel, {
    through: Model_has_roles,
    foreignKey: 'role_id',
});

UserModel.hasMany(Model_has_roles, {
    foreignKey: 'model_id',
});

Model_has_roles.belongsTo(UserModel, {
    foreignKey: 'model_id',
});

RoleModel.hasMany(Model_has_roles, {
    foreignKey: 'role_id',
});

Model_has_roles.belongsTo(RoleModel, {
    foreignKey: 'role_id',
});

RoleModel.belongsToMany(PermissionModel, {
    through: role_has_permissions,
    foreignKey: 'role_id',
});
PermissionModel.belongsToMany(RoleModel, {
    through: role_has_permissions,
    foreignKey: 'permission_id',
});

MovieModel.belongsToMany(RegionsModel, {
    through: Movie_region,
    foreignKey: 'movie_id',
});
RegionsModel.belongsToMany(MovieModel, {
    through: Movie_region,
    foreignKey: 'region_id',
});

MovieModel.belongsToMany(TagModel, {
    through: movie_tag,
    foreignKey: 'movie_id',
});
TagModel.belongsToMany(MovieModel, {
    through: movie_tag,
    foreignKey: 'tag_id',
});

MovieModel.hasMany(EpisodeModel, { foreignKey: 'movie_id' });
EpisodeModel.belongsTo(MovieModel, { foreignKey: 'movie_id' });

MovieModel.belongsToMany(ActorModel, {
    through: Actor_Movie,
    foreignKey: 'movie_id',
});
ActorModel.belongsToMany(MovieModel, {
    through: Actor_Movie,
    foreignKey: 'actor_id',
});

MovieModel.belongsToMany(DirectorModel, {
    through: Director_movie,
    foreignKey: 'movie_id',
});
DirectorModel.belongsToMany(MovieModel, {
    through: Director_movie,
    foreignKey: 'director_id',
});

MovieModel.belongsToMany(CategoriesModel, {
    through: Category_movie,
    foreignKey: 'movie_id',
});

CategoriesModel.belongsToMany(MovieModel, {
    through: Category_movie,
    foreignKey: 'category_id',
});

MovieModel.hasMany(Category_movie, {
    foreignKey: 'movie_id',

    as: 'category_movie',
});
Category_movie.belongsTo(MovieModel, {
    foreignKey: 'movie_id',
    as: 'movies',
});

CategoriesModel.hasMany(Category_movie, {
    foreignKey: 'category_id',
    as: 'category_movie',
});
Category_movie.belongsTo(CategoriesModel, {
    foreignKey: 'category_id',
    as: 'categories',
});

CatalogModel.hasMany(content_sections_model, {
    foreignKey: 'catalog_id',
});

content_sections_model.belongsTo(CatalogModel, {
    foreignKey: 'catalog_id',
});

content_sections_model.belongsToMany(MovieModel, {
    through: content_section_movie,
    foreignKey: 'content_section_id',
});

MovieModel.belongsToMany(content_sections_model, {
    through: content_section_movie,
    foreignKey: 'movie_id',
});

MovieModel.hasMany(RatingModel, {
    foreignKey: 'movie_id',
});

RatingModel.belongsTo(MovieModel, {
    foreignKey: 'movie_id',
});

UserModel.hasMany(RatingModel, {
    foreignKey: 'user_id',
});

RatingModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
});

// UserModel.belongsToMany(MovieModel, {
//     through: RatingModel,
//     foreignKey: 'user_id',
// });

// MovieModel.belongsToMany(UserModel, {
//     through: RatingModel,
//     foreignKey: 'movie_id',
// });

UserModel.hasMany(UserWatchEpisode, {
    foreignKey: 'user_id',
});

UserWatchEpisode.belongsTo(UserModel, {
    foreignKey: 'user_id',
});

EpisodeModel.hasMany(UserWatchEpisode, {
    foreignKey: 'episode_id',
});

UserWatchEpisode.belongsTo(EpisodeModel, {
    foreignKey: 'episode_id',
});

UserModel.belongsToMany(EpisodeModel, {
    through: UserWatchEpisode,
    foreignKey: 'user_id',
});

EpisodeModel.belongsToMany(UserModel, {
    through: UserWatchEpisode,
    foreignKey: 'episode_id',
});

WachingMoviePackage.belongsToMany(MoviePackageBenefit, {
    through: WachingMoviePackageHasBenefit,
    foreignKey: 'waching_movie_package_id',
});

MoviePackageBenefit.belongsToMany(WachingMoviePackage, {
    through: WachingMoviePackageHasBenefit,
    foreignKey: 'movie_package_benefit_id',
});

EpisodeModel.belongsToMany(waching_movie_package, {
    through: EpisodeRequiredWachingPackage,
    foreignKey: 'episode_id',
});

waching_movie_package.belongsToMany(EpisodeModel, {
    through: EpisodeRequiredWachingPackage,
    foreignKey: 'waching_movie_package_id',
});

MovieModel.belongsToMany(waching_movie_package, {
    through: MovieRequiredWachingPackage,
    foreignKey: 'movie_id',
});

waching_movie_package.belongsToMany(MovieModel, {
    through: MovieRequiredWachingPackage,
    foreignKey: 'waching_movie_package_id',
});

UserModel.hasMany(BillModel, {
    foreignKey: 'user_id',
});

BillModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
});

UserModel.belongsToMany(WachingMoviePackage, {
    through: UserHasWachingPackage,
    foreignKey: 'user_id',
});

WachingMoviePackage.belongsToMany(UserModel, {
    through: UserHasWachingPackage,
    foreignKey: 'waching_movie_package_id',
});

module.exports = {
    UserModel,
    MovieModel,
    RoleModel,
    Model_has_roles,
    PermissionModel,
    RegionsModel,
    TagModel,
    BillModel,
    EpisodeModel,
    ActorModel,
    DirectorModel,
    CategoriesModel,
    CatalogModel,
    content_sections_model,
    RatingModel,
    UserWatchEpisode,
    WachingMoviePackage,
    MoviePackageBenefit,
};
