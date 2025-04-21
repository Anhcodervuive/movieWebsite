import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import useGetAPIData from '@/hooks/useGetAPIData';
import ActorService from '@/service/admin/actor.service';

import { DefaultToast } from '@/components/UI/ToastMessage';
import Form from '../components/Form';
import Loading from '@/components/UI/Loading';
import config from '@/config';

function EditActor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAPIData(
        async () => await ActorService.getActor(id),
        null,
        [id]
    );
    const onSubmit = async (formData) => {
        console.log(formData);

        await ActorService.update(id, formData)
            .then((res) => {
                console.log(res);
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
    console.log(data);

    if (isLoading || isError) {
        return <Loading />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form onSubmit={onSubmit} data={data?.actor} />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default EditActor;
