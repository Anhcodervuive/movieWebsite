import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import ActorService from '@/service/admin/actor.service';

import styles from './ActorHome.module.css';
import Button from '@/components/UI/Button';
import Table from '@/components/admin/Table';
import useGetAPIData from '@/hooks/useGetAPIData';
import Loading from '@/components/UI/Loading';
import config from '@/config';
import { toast, ToastContainer } from 'react-toastify';
import { DefaultToast } from '@/components/UI/ToastMessage';
import { useDebounce } from '@/hooks';

function useQuery() {
    return new URLSearchParams(useLocation().state);
}

const cx = classNames.bind(styles);

function ActorHome() {
    const query = useQuery();
    const navigator = useNavigate();
    const message = query.get('message');
    const type = query.get('type');
    const [searchValue, setSearhValue] = useState('');
    const searchDebounce = useDebounce(searchValue, 1000);
    const { data, isLoading, isError } = useGetAPIData(
        async () => {
            return await ActorService.getAll({ name: searchDebounce });
        },
        null,
        [searchDebounce]
    );
    const onEditactor = useCallback(
        (id) => {
            navigator(config.routes.admin.actor.edit(id));
        },
        [navigator]
    );
    const onDeleteActor = useCallback(async (id) => {
        const result = await ActorService.delete(id)
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

    console.log(searchValue);

    if (isLoading || isError) {
        return <Loading />;
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h2>Danh sách diễn viên:</h2>
                <Button
                    success
                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    to={config.routes.admin.actor.create}>
                    Thêm diễn viên
                </Button>
            </div>
            {data && (
                <Table
                    data={data.actors}
                    attributesToShow={['name', 'slug', 'gender', 'created_at']}
                    onEdit={onEditactor}
                    onDelete={onDeleteActor}
                    onSearch={setSearhValue}
                    initSearchValue={searchValue}
                />
            )}
            <ToastContainer theme='dark' />
        </div>
    );
}

export default ActorHome;
