import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Form from '../components/Form';

import RoleService from '@/service/admin/role.service';
import PermissionService from '@/service/admin/permission.service';
import { DefaultToast } from '@/components/UI/ToastMessage';
import config from '@/config';
import useGetAPIData from '@/hooks/useGetAPIData';
import Loading from '@/components/UI/Loading';

function CreateRole() {
    const navigate = useNavigate();
    const { data: dataPermission, isLoading: isPermissionLoading } =
        useGetAPIData(async () => await PermissionService.getAll(), null, []);
    const onSubmit = async (formData) => {
        await RoleService.create(formData)
            .then((res) => {
                navigate(config.routes.admin.role.home, {
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

    if (isPermissionLoading) {
        return <Loading />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form
                onSubmit={onSubmit}
                data={null}
                permissions={dataPermission?.permissions}
            />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default CreateRole;
