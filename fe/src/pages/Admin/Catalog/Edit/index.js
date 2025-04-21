import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

import CatalogService from '@/service/admin/catalog.service';
import useGetAPIData from '@/hooks/useGetAPIData';

import Form from '../Components/Form';
import { DefaultToast } from '@/components/UI/ToastMessage';
import Loading from '@/components/UI/Loading';
import config from '@/config';

function EditCatalog() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useGetAPIData(
        async () => await CatalogService.getCatalog(id),
        null,
        [id]
    );

    const onSubmit = async (formData) => {
        const newPageContents = formData.pageContents.map((pageContent) => ({
            ...pageContent,
            movies: pageContent.movies.map((movie) => ({ id: movie.id })),
        }));
        const data = {
            ...formData,
            pageContents: newPageContents,
        };

        await CatalogService.update(id, data)
            .then((res) => {
                console.log(res);
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

    if (isLoading || isError) {
        return <Loading />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form
                onSubmit={onSubmit}
                data={{
                    ...data?.catalog,
                    pageContents: data?.catalog.content_sections,
                }}
            />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default EditCatalog;
