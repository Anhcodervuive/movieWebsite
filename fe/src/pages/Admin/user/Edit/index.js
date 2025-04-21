import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import useGetAPIData from '@/hooks/useGetAPIData';
import UserService from '@/service/admin/user.service';
import RoleService from '@/service/admin/role.service';
import WachingMoviePackageService from '@/service/admin/watchingMoviePackage.service';

import { DefaultToast } from '@/components/UI/ToastMessage';
import Form from '../components/Form';
import Loading from '@/components/UI/Loading';
import config from '@/config';

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAPIData(
        async () => await UserService.getById(id),
        null,
        [id]
    );
    const { data: dataRole, isLoading: isRoleLoading } = useGetAPIData(
        async () => await RoleService.getAll(),
        null,
        []
    );
    const {
        data: dataWatchingMoviePackage,
        isLoading: isWatchingMoviePackageLoading,
    } = useGetAPIData(
        async () => await WachingMoviePackageService.getAll(),
        null,
        []
    );
    const onSubmit = async (formData) => {
        console.log(formData);

        await UserService.update(id, formData)
            .then((res) => {
                console.log(res);
                navigate(config.routes.admin.user.home, {
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

    if (
        isLoading ||
        isRoleLoading ||
        isWatchingMoviePackageLoading ||
        isError
    ) {
        return <Loading />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form
                onSubmit={onSubmit}
                data={data?.user}
                roles={dataRole?.roles}
                wachingMoviePackages={
                    dataWatchingMoviePackage?.wachingMoviePackages
                }
            />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default EditUser;
