import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Form from '../components/Form';

import UserService from '@/service/admin/user.service';
import RoleService from '@/service/admin/role.service';
import WachingMoviePackageService from '@/service/admin/watchingMoviePackage.service';
import { DefaultToast } from '@/components/UI/ToastMessage';
import config from '@/config';
import useGetAPIData from '@/hooks/useGetAPIData';
import Loading from '@/components/UI/Loading';

function CreateUser() {
    const navigate = useNavigate();
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
        await UserService.create(formData)
            .then((res) => {
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

    if (isRoleLoading || isWatchingMoviePackageLoading) {
        return <Loading />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form
                onSubmit={onSubmit}
                data={null}
                roles={dataRole?.roles}
                wachingMoviePackages={
                    dataWatchingMoviePackage?.wachingMoviePackages
                }
            />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default CreateUser;
