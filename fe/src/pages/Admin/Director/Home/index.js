import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import classNames from 'classnames/bind';

import styles from './DirectorHome.module.css';

import Table from '@/components/admin/Table';
import Button from '@/components/UI/Button';
import config from '@/config';

import DirectorService from '@/service/admin/director.service';
import useGetAPIData from '@/hooks/useGetAPIData';
import Loading from '@/components/UI/Loading';
import { DefaultToast } from '@/components/UI/ToastMessage';
import { useDebounce } from '@/hooks';

const cx = classNames.bind(styles);

function useQuery() {
    return new URLSearchParams(useLocation().state);
}

function DirectorHome() {
    const query = useQuery();
    const navigator = useNavigate();
    const message = query.get('message');
    const type = query.get('type');
    const [searchValue, setSearhValue] = useState('');
    const searchValueDebounce = useDebounce(searchValue, 1000);
    const { data, isLoading, isError } = useGetAPIData(
        async () => await DirectorService.getAll({ name: searchValueDebounce }),
        null,
        [searchValueDebounce]
    );

    const onEditactor = useCallback(
        (id) => {
            navigator(config.routes.admin.director.edit(id));
        },
        [navigator]
    );

    const onDeleteActor = useCallback(async (id) => {
        const result = await DirectorService.delete(id)
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
                <h2>Danh sách đạo diễn:</h2>
                <Button
                    success
                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    to={config.routes.admin.director.create}>
                    Thêm đạo diễn
                </Button>
            </div>
            {data && (
                <Table
                    data={data.directors}
                    attributesToShow={['name', 'slug', 'gender', 'created_at']}
                    onEdit={onEditactor}
                    onDelete={onDeleteActor}
                    onSearch={setSearhValue}
                    initSearchValue={searchValue}
                />
            )}
        </div>
    );
}

export default DirectorHome;
