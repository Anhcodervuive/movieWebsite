import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import useGetAPIData from '@/hooks/useGetAPIData';
import MoviePackageBenefitService from '@/service/admin/moviePackageBenefit.service';
import WatchingMoviePackageService from '@/service/admin/watchingMoviePackage.service';

import { DefaultToast } from '@/components/UI/ToastMessage';
import Form from '../components/Form';
import Loading from '@/components/UI/Loading';
import config from '@/config';

function EditWatchingMoviePackage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAPIData(
        async () => await WatchingMoviePackageService.getById(id),
        null,
        [id]
    );
    const {
        data: moviePackageBenefits,
        isLoading: isMoviePackageBenefitsLoading,
        isError: isMoviePackageBenefitsError,
    } = useGetAPIData(
        async () => await MoviePackageBenefitService.getAll(),
        [],
        []
    );
    const onSubmit = async (formData) => {
        console.log(formData);

        await WatchingMoviePackageService.update(id, formData)
            .then((res) => {
                console.log(res);
                navigate(config.routes.admin.watchingMoviePackage.home, {
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

    if (isLoading || isMoviePackageBenefitsLoading || isError) {
        return <Loading />;
    } else if (isMoviePackageBenefitsError) {
        return <div>Error</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form
                onSubmit={onSubmit}
                data={data?.wachingMoviePackage}
                moviePackageBenefits={moviePackageBenefits.moviePackageBenefits}
            />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default EditWatchingMoviePackage;
