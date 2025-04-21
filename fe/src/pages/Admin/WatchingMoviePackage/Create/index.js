import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Form from '../components/Form';

import MoviePackageBenefitService from '@/service/admin/moviePackageBenefit.service';
import WatchingMoviePackageService from '@/service/admin/watchingMoviePackage.service';
import { DefaultToast } from '@/components/UI/ToastMessage';
import config from '@/config';
import useGetAPIData from '@/hooks/useGetAPIData';
import Loading from '@/components/UI/Loading';

function CreateWatchingMoviePackage() {
    const navigate = useNavigate();
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
        await WatchingMoviePackageService.create(formData)
            .then((res) => {
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

    if (isMoviePackageBenefitsLoading) {
        return <Loading />;
    } else if (isMoviePackageBenefitsError) {
        return <div>error</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form
                onSubmit={onSubmit}
                moviePackageBenefits={moviePackageBenefits.moviePackageBenefits}
                data={null}
            />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default CreateWatchingMoviePackage;
