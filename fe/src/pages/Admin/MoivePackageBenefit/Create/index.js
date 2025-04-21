import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Form from '../components/Form';

import MoviePackageBenefitService from '@/service/admin/moviePackageBenefit.service';
import { DefaultToast } from '@/components/UI/ToastMessage';
import config from '@/config';

function CreateMoviePackageBenefits() {
    const navigate = useNavigate();
    const onSubmit = async (formData) => {
        await MoviePackageBenefitService.create(formData)
            .then((res) => {
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

    return (
        <div style={{ padding: '20px' }}>
            <Form onSubmit={onSubmit} data={null} />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default CreateMoviePackageBenefits;
