import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import useGetAPIData from '@/hooks/useGetAPIData';
import MoviePackageBenefitService from '@/service/admin/moviePackageBenefit.service';

import { DefaultToast } from '@/components/UI/ToastMessage';
import Form from '../components/Form';
import Loading from '@/components/UI/Loading';
import config from '@/config';

function EditMoviePackageBenefit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAPIData(
        async () => await MoviePackageBenefitService.getById(id),
        null,
        [id]
    );
    const onSubmit = async (formData) => {
        console.log(formData);

        await MoviePackageBenefitService.update(id, formData)
            .then((res) => {
                console.log(res);
                navigate(config.routes.admin.moviePackageBenefits.home, {
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

    if (isLoading || isError) {
        return <Loading />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form onSubmit={onSubmit} data={data?.moviePackageBenefit} />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default EditMoviePackageBenefit;
