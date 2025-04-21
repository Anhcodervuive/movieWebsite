import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import useGetAPIData from '@/hooks/useGetAPIData';
import RegionService from '@/service/admin/region.service';

import { DefaultToast } from '@/components/UI/ToastMessage';
import Form from '../components/Form';
import Loading from '@/components/UI/Loading';
import config from '@/config';

function EditRegion() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAPIData(
        async () => await RegionService.getById(id),
        null,
        [id]
    );
    const onSubmit = async (formData) => {
        console.log(formData);

        await RegionService.update(id, formData)
            .then((res) => {
                console.log(res);
                navigate(config.routes.admin.region.home, {
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
            <Form onSubmit={onSubmit} data={data?.region} />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default EditRegion;
