const { Op, where } = require('sequelize');
const jwt = require('jsonwebtoken');

const catalogService = require('../../services/catalog.service');
const contentSectionService = require('../../services/content_section.service');
const ApiError = require('../../api-error');
const {
    content_sections_model,
    MovieModel,
    RegionsModel,
    EpisodeModel,
    UserWatchEpisode,
    UserModel,
} = require('../../models');
const config = require('../../config');
const waching_movie_package = require('../../models/waching_movie_package.model');

class CatalogController {
    constructor(catalogService, contentSectionService) {
        this.catalogService = catalogService;
        this.contentSectionService = contentSectionService;
    }

    getCatalog = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = req.user;
            const catalog = await this.catalogService.getCatalog({
                where: {
                    id,
                },
                attributes: ['id', 'name', 'slug'],
                include: [
                    {
                        model: content_sections_model,
                        include: [
                            {
                                model: MovieModel,
                                include: [
                                    {
                                        model: RegionsModel,
                                        attributes: ['name'],
                                    },
                                    {
                                        model: waching_movie_package,
                                        attributes: ['name'],
                                    },
                                    {
                                        model: EpisodeModel,
                                        attributes: ['slug', 'type'],
                                        where: {
                                            type: {
                                                [Op.like]: 'm3u8',
                                            },
                                        },
                                        include: [
                                            {
                                                model: UserWatchEpisode,
                                                where: {
                                                    user_id: user?.id ?? null,
                                                },

                                                required: false,
                                                // separate: true,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            return res.json({ catalog });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    getAllCatalog = async (req, res, next) => {
        try {
            const catalogs = await this.catalogService.getCatalogs({
                attributes: ['id', 'name', 'slug'],
            });
            return res.json({ catalogs });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    createCatalog = async (req, res, next) => {
        try {
            const { name, slug, pageContents } = req.body;

            const catalog = await this.catalogService.getCatalog({
                where: {
                    slug,
                },
            });

            if (catalog) {
                return res.status(400).json({ message: 'slug đã tồn tại' });
            }

            const catalogModel = await this.catalogService.createCatalog({
                name,
                slug,
            });

            for (let i = 0; i < pageContents.length; i++) {
                const { name, type, movies } = pageContents[i];

                const contentSectionModel =
                    await this.contentSectionService.createContentSection({
                        name,
                        type,
                        catalog_id: catalogModel.id,
                    });

                await contentSectionModel.setMovies(
                    movies.map((movie) => movie.id)
                );
            }

            return res.json({ message: 'Tạo thành công', type: 'success' });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    updateCatalog = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { name, slug, pageContents } = req.body;
            console.log(name, slug, pageContents);

            const catalog = await this.catalogService.getCatalog({
                where: {
                    slug,
                },
            });

            if (catalog && catalog?.id != id) {
                return res.status(400).json({ message: 'slug đã tồn tại' });
            }

            const catalogModel = await this.catalogService.updateCatalog(
                {
                    name,
                    slug,
                },
                id
            );

            await this.contentSectionService.deleteContentSectionByCatalog(id);

            for (let i = 0; i < pageContents.length; i++) {
                const { name, type, movies } = pageContents[i];
                console.log(catalogModel.id);

                const contentSectionModel =
                    await this.contentSectionService.createContentSection({
                        name,
                        type,
                        catalog_id: id,
                    });

                await contentSectionModel.setMovies(
                    movies.map((movie) => movie.id)
                );
            }

            return res.json({
                message: 'Cập nhật thành công',
                type: 'success ',
            });
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };

    deleteCatalog = async (req, res, next) => {
        try {
            const { id } = req.params;
            const deleteRecord = await this.catalogService.deleteCatalog(id);

            if (deleteRecord > 0) {
                return res.json({ message: 'Xóa thành công', type: 'success' });
            } else {
                return res.status(400).json({
                    message: 'Không tìm thấy catalog cần xóa',
                    type: 'error',
                });
            }
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    };
}

module.exports = new CatalogController(catalogService, contentSectionService);
