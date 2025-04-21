import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import useGetAPIData from '@/hooks/useGetAPIData';
import RoleService from '@/service/admin/role.service';
import PermissionService from '@/service/admin/permission.service';

import { DefaultToast } from '@/components/UI/ToastMessage';
import Form from '../components/Form';
import Loading from '@/components/UI/Loading';
import config from '@/config';

function EditRole() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetAPIData(
        async () => await RoleService.getById(id),
        null,
        [id]
    );
    const { data: dataPermission, isLoading: isPermissionLoading } =
        useGetAPIData(async () => await PermissionService.getAll(), null, []);
    const onSubmit = async (formData) => {
        console.log(formData);

        await RoleService.update(id, formData)
            .then((res) => {
                console.log(res);
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

    if (isLoading || isPermissionLoading || isError) {
        return <Loading />;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Form
                onSubmit={onSubmit}
                data={data?.role}
                permissions={dataPermission?.permissions}
            />
            <ToastContainer theme='dark' />
        </div>
    );
}

export default EditRole;
