import { toast, ToastContainer } from 'react-toastify';

import Form from '../components/Form';

import VideoService from '@/service/admin/video.service';

function CreateVideo() {
    const onSubmit = async (formData) => {
        await toast
            .promise(VideoService.create(formData), {
                success: 'Lưu video quảng cáo thành công',
                pending: 'Đang xử lý video',
                error: 'Lưu video quảng cáo không thành công',
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
                toast.error(err.response.data.message, {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
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

export default CreateVideo;
