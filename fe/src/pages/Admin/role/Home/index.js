import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';
import classNames from 'classnames/bind';

import styles from './Role.module.css';

import Table from '@/components/admin/Table';
import Button from '@/components/UI/Button';
import config from '@/config';

import RoleService from '@/service/admin/role.service';
import useGetAPIData from '@/hooks/useGetAPIData';
import Loading from '@/components/UI/Loading';
import { DefaultToast } from '@/components/UI/ToastMessage';

const cx = classNames.bind(styles);

function useQuery() {
    return new URLSearchParams(useLocation().state);
}

function RoleHome() {
    const query = useQuery();
    const navigator = useNavigate();
    const message = query.get('message');
    const type = query.get('type');
    const { data, isLoading, isError } = useGetAPIData(
        async () => await RoleService.getAll(),
        null,
        []
    );

    const onEditactor = useCallback(
        (id) => {
            navigator(config.routes.admin.role.edit(id));
        },
        [navigator]
    );

    const onDeleteActor = useCallback(async (id) => {
        const result = await RoleService.delete(id)
            .then((res) => {
                console.log(res);
                toast(DefaultToast, {
                    style: { width: '400px' },
                    hideProgressBar: true,
                    data: {
                        type: 'success',
                        title: 'Thành công',
                        message: res.message,
                    },
                });

                return true;
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

                return false;
            });

        return result;
    }, []);

    useEffect(() => {
        if (message && type) {
            console.log(type, message);
            toast(DefaultToast, {
                style: { width: '400px' },
                hideProgressBar: true,
                data: {
                    type: type,
                    title: 'Thành công',
                    message: message,
                },
            });
            navigator('.', { replace: true });
        }
    }, [message, navigator, type]);

    if (isLoading || isError) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2>Danh sách role:</h2>
                <Button
                    success
                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    to={config.routes.admin.role.create}>
                    Thêm role
                </Button>
            </div>
            {data && (
                <Table
                    data={data?.roles}
                    attributesToShow={['name', 'created_at']}
                    onEdit={onEditactor}
                    onDelete={onDeleteActor}
                />
            )}
            <ToastContainer theme='dark' />
        </div>
    );
}

export default RoleHome;
