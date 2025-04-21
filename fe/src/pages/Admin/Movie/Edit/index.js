import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import useGetAPIData from '@/hooks/useGetAPIData';
import MovieService from '@/service/admin/movie.service';
import WatchingMoviePackageService from '@/service/admin/watchingMoviePackage.service';
import CategoryService from '@/service/admin/category.service';
import RegionService from '@/service/admin/region.service';

import { DefaultToast } from '@/components/UI/ToastMessage';
import Form from '../components/Form';
import Loading from '@/components/UI/Loading';
import config from '@/config';

function EditMovie() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAPIData(
        async () => await MovieService.getById(id),
        null,
        [id]
    );
    const { data: dataCategories, isLoading: isCategoriesLoading } =
        useGetAPIData(async () => await CategoryService.getAll(), null, []);
    const { data: dataRegions, isLoading: isRegionsLoading } = useGetAPIData(
        async () => await RegionService.getAll(),
        null,
        []
    );
    const {
        data: dataWatchingMoviePackage,
        isLoading: isWatchingMoviePackageLoading,
    } = useGetAPIData(
        async () => await WatchingMoviePackageService.getAll(),
        null,
        []
    );
    const onSubmit = async (formData) => {
        console.log(formData);
        const newFormData = {
            ...formData,
            origin_name: formData.originName,
            thumb_url: formData.thumbnailUrl,
            poster_url: formData.posterUrl,
            showtimes: formData.showTimes,
            episode_time: formData.episodeTime,
            episode_current: formData.episodeCurrent,
            episode_total: formData.episodeTotal,
            publish_year: formData.publishYear,
            actorIds: formData.actors.map((actor) => actor.id),
            directorIds: formData.directors.map((director) => director.id),
            is_recommended: formData.isRecommended,
            is_shown_in_theater: formData.isShownInTheater,
            is_sensitive_content: formData.isSensitiveContent,
            waching_movie_packages: formData.watchingMoviePackages,
        };
        await MovieService.update(id, newFormData)
            .then((res) => {
                console.log(res);
                navigate(config.routes.admin.moive.home, {
                    state: { message: res.message, type: res.type },
                });
            })
            .catch((err) => {
                console.log(err);

                toast(DefaultToast, {
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'error',
                        title: 'Lỗi',
                        message: err.response.data.message,
                    },
                });
            });
    };
    console.log(data);

    if (
        isLoading ||
        isError ||
        isCategoriesLoading ||
        isRegionsLoading ||
        isWatchingMoviePackageLoading
    ) {
        return <Loading />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form
                onSubmit={onSubmit}
                data={data?.movie}
                categories={dataCategories?.categories}
                regions={dataRegions?.regions}
                watchingMoviePackages={
                    dataWatchingMoviePackage.wachingMoviePackages
                }
            />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default EditMovie;
