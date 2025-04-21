import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Form from '../components/Form';

import ActorService from '@/service/admin/actor.service';
import { DefaultToast } from '@/components/UI/ToastMessage';
import config from '@/config';

function CreateActor() {
    const navigate = useNavigate();
    const onSubmit = async (formData) => {
        await ActorService.create(formData)
            .then((res) => {
                navigate(config.routes.admin.actor.home, {
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

export default CreateActor;
