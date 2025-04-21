import config from '@/config';
import AdminLayout from '@/layouts/AdminLayout';
import ProfileLayout from '@/layouts/ProfileLayout';
import Login from '@/pages/Auth';
import { SearchHome, SearchResult } from '@/pages/Search';
import WatchMovie from '@/pages/WatchMovie';
import { HomeProfile, History } from '@/pages/Profile';
import HomeCatalog from '@/pages/Admin/Catalog/Home';
import CreateCatalog from '@/pages/Admin/Catalog/Create';
import EditCatalog from '@/pages/Admin/Catalog/Edit';
import ActorHome from '@/pages/Admin/Actor/Home';
import CreateActor from '@/pages/Admin/Actor/Create';
import EditActor from '@/pages/Admin/Actor/Edit';
import CategoryHome from '@/pages/Admin/Category/Home';
import CreateCategory from '@/pages/Admin/Category/Create';
import EditCategory from '@/pages/Admin/Category/Edit';
import RegionHome from '@/pages/Admin/Region/Home';
import CreateRegion from '@/pages/Admin/Region/Create';
import EditRegion from '@/pages/Admin/Region/Edit';
import DirectorHome from '@/pages/Admin/Director/Home';
import CreateDirector from '@/pages/Admin/Director/Create';
import EditDirector from '@/pages/Admin/Director/Edit';
import VideoHome from '@/pages/Admin/Video/Home';
import EditVideo from '@/pages/Admin/Video/Edit';
import CreateVideo from '@/pages/Admin/Video/Create';
import MoviePackageBenefitHome from '@/pages/Admin/MoivePackageBenefit/Home';
import CreateMoviePackageBenefits from '@/pages/Admin/MoivePackageBenefit/Create';
import EditMoviePackageBenefit from '@/pages/Admin/MoivePackageBenefit/Edit';
import WatchingMoviePackageHome from '@/pages/Admin/WatchingMoviePackage/Home';
import CreateWatchingMoviePackage from '@/pages/Admin/WatchingMoviePackage/Create';
import EditWatchingMoviePackage from '@/pages/Admin/WatchingMoviePackage/Edit';
import MovieHome from '@/pages/Admin/Movie/Home';
import CreateMovie from '@/pages/Admin/Movie/Create';
import EditMovie from '@/pages/Admin/Movie/Edit';
import WatchingMoviePackage from '@/pages/Profile/WatchingMoviePackage';
import BillHome from '@/pages/Admin/Bill/Home';
import EditInfor from '@/pages/Profile/EditInfor';
import DashBoard from '@/pages/Admin/DashBoard';
import RoleHome from '@/pages/Admin/role/Home';
import EditRole from '@/pages/Admin/role/Edit';
import CreateRole from '@/pages/Admin/role/Create';
import CreateUser from '@/pages/Admin/user/Create';
import EditUser from '@/pages/Admin/user/Edit';
import UserHome from '@/pages/Admin/user/Home';

const publicRoutes = [
    { path: config.routes.search, component: SearchHome },
    { path: config.routes.SearchResult, component: SearchResult },
    { path: config.routes.watchMovie.toString(), component: WatchMovie },
    { path: config.routes.login, component: Login, layout: null },
    { path: config.routes.register, component: Login, layout: null },
];

const privateRoutes = [
    {
        path: config.routes.admin.dashboard,
        component: DashBoard,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.profile.home,
        component: HomeProfile,
        layout: ProfileLayout,
        requires: {
            requireAuth: true,
        },
    },
    {
        path: config.routes.profile.history,
        component: History,
        layout: ProfileLayout,
        requires: {
            requireAuth: true,
        },
    },
    {
        path: config.routes.profile.watchingMoviePackage,
        component: WatchingMoviePackage,
        layout: ProfileLayout,
        requires: {
            requireAuth: true,
        },
    },
    {
        path: config.routes.profile.editInfor,
        component: EditInfor,
        layout: ProfileLayout,
        requires: {
            requireAuth: true,
        },
    },
    {
        path: config.routes.admin.moive.home,
        component: MovieHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.moive.create,
        component: CreateMovie,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.moive.edit(),
        component: EditMovie,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.catalog.home,
        component: HomeCatalog,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.catalog.create,
        component: CreateCatalog,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.catalog.edit(),
        component: EditCatalog,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.actor.home,
        component: ActorHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.actor.create,
        component: CreateActor,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.actor.edit(),
        component: EditActor,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.category.home,
        component: CategoryHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.category.create,
        component: CreateCategory,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.category.edit(),
        component: EditCategory,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.region.home,
        component: RegionHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.region.create,
        component: CreateRegion,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.region.edit(),
        component: EditRegion,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.director.home,
        component: DirectorHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.director.create,
        component: CreateDirector,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.director.edit(),
        component: EditDirector,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.video.home,
        component: VideoHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.video.create,
        component: CreateVideo,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.video.edit(),
        component: EditVideo,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.moviePackageBenefits.home,
        component: MoviePackageBenefitHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.moviePackageBenefits.create,
        component: CreateMoviePackageBenefits,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.moviePackageBenefits.edit(),
        component: EditMoviePackageBenefit,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.watchingMoviePackage.home,
        component: WatchingMoviePackageHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.watchingMoviePackage.create,
        component: CreateWatchingMoviePackage,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.watchingMoviePackage.edit(),
        component: EditWatchingMoviePackage,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.bill.home,
        component: BillHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.role.create,
        component: CreateRole,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.role.edit(),
        component: EditRole,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.role.home,
        component: RoleHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.user.create,
        component: CreateUser,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.user.edit(),
        component: EditUser,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
    {
        path: config.routes.admin.user.home,
        component: UserHome,
        layout: AdminLayout,
        requires: {
            requiredRoles: ['Admin'],
        },
    },
];

export { privateRoutes, publicRoutes };
