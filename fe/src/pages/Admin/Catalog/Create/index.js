import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import CatalogService from '@/service/admin/catalog.service';

import Form from '../Components/Form';
import { DefaultToast } from '@/components/UI/ToastMessage';
import config from '@/config';

function CreateCatalog() {
    const navigate = useNavigate();
    const onSubmit = async (formData) => {
        const newPageContents = formData.pageContents.map((pageContent) => ({
            ...pageContent,
            movies: pageContent.movies.map((movie) => ({ id: movie.id })),
        }));
        const data = {
            ...formData,
            pageContents: newPageContents,
        };

        await CatalogService.create(data)
            .then((res) => {
                navigate(config.routes.admin.catalog.home, {
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

export default CreateCatalog;
