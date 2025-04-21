const routes = {
    home: '/',
    search: '/tim-kiem',
    SearchResult: '/ket-qua-tim-kiem',
    watchMovie: {
        withParam: (slug, eps) => `/xem-phim/${slug}/${eps}`,
        toString: () => '/xem-phim/:slugPhim/:slugTap',
    },
    login: '/dang-nhap',
    register: '/dang-ky',
    test: '/test',
    profile: {
        home: '/tai-khoan',
        history: '/tai-khoan/lich-su',
        watchingMoviePackage: '/tai-khoan/goi-dang-ky',
        editInfor: '/tai-khoan/chinh-sua-thong-tin',
    },
    admin: {
        dashboard: '/admin/dasboard',
        moive: {
            home: '/admin/movie',
            create: '/admin/movie/create',
            edit: (id = '') => `/admin/movie/update/${id || ':id'}`,
        },
        catalog: {
            home: '/admin/catalog',
            create: '/admin/catalog/create',
            edit: (id = '') => `/admin/catalog/update/${id || ':id'}`,
        },
        actor: {
            home: '/admin/actor',
            create: '/admin/actor/create',
            edit: (id = '') => `/admin/actor/update/${id || ':id'}`,
        },
        category: {
            home: '/admin/category',
            create: '/admin/category/create',
            edit: (id = '') => `/admin/category/update/${id || ':id'}`,
        },
        region: {
            home: '/admin/region',
            create: '/admin/region/create',
            edit: (id = '') => `/admin/region/update/${id || ':id'}`,
        },
        director: {
            home: '/admin/director',
            create: '/admin/director/create',
            edit: (id = '') => `/admin/director/update/${id || ':id'}`,
        },
        video: {
            home: '/admin/video',
            create: '/admin/video/create',
            edit: (id = '') => `/admin/video/update/${id || ':id'}`,
        },
        moviePackageBenefits: {
            home: '/admin/movie-package-benefits',
            create: '/admin/movie-package-benefits/create',
            edit: (id = '') =>
                `/admin/movie-package-benefits/update/${id || ':id'}`,
        },
        watchingMoviePackage: {
            home: '/admin/watching-movie-package',
            create: '/admin/watching-movie-package/create',
            edit: (id = '') =>
                `/admin/watching-movie-package/update/${id || ':id'}`,
        },
        bill: {
            home: '/admin/bill',
        },
        role: {
            home: '/admin/role',
            create: '/admin/role/create',
            edit: (id = '') => `/admin/role/update/${id || ':id'}`,
        },
        user: {
            home: '/admin/user',
            create: '/admin/user/create',
            edit: (id = '') => `/admin/user/update/${id || ':id'}`,
        },
    },
    error: {
        notFound: '/404',
        forbidden: '/403',
        internalServerError: '/500',
    },
};

export default routes;
