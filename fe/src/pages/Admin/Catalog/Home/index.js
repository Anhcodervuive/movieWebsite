import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import useGetAPIData from '@/hooks/useGetAPIData';

import CatalogService from '@/service/admin/catalog.service';

import styles from './CatalogHome.module.css';
import Loading from '@/components/UI/Loading';
import Table from '@/components/admin/Table';
import { DefaultToast } from '@/components/UI/ToastMessage';
import config from '@/config';
import Button from '@/components/UI/Button';

const cx = classNames.bind(styles);

function useQuery() {
    return new URLSearchParams(useLocation().state);
}

function Home() {
    const navigator = useNavigate();
    const query = useQuery();
    const message = query.get('message');
    const type = query.get('type');
    const { data, isLoading, isError } = useGetAPIData(
        async () => await CatalogService.getAll(),
        null,
        [message]
    );

    const onEditCatalog = useCallback(
        (id) => {
            navigator(config.routes.admin.catalog.edit(id));
        },
        [navigator]
    );

    const onDeleteCatalog = useCallback(
        async (id) => {
            const result = await CatalogService.delete(id)
                .then((res) => {
                    navigator(config.routes.admin.catalog.home, {
                        state: { message: res.message, type: res.type },
                    });

                    return true;
                })
                .catch((err) => {
                    toast(DefaultToast, {
                        style: { width: '400px' },
                        hideProgressBar: true,
                        data: {
                            type: err.type,
                            title: 'Thành công',
                            message: err.message,
                        },
                    });

                    return false;
                });

            return result;
        },
        [navigator]
    );

    const onCreateCatalog = useCallback(() => {
        navigator(config.routes.admin.catalog.create);
    }, [navigator]);

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
                <h2>Danh sách catalog:</h2>
                <Button
                    success
                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    onClick={onCreateCatalog}>
                    Tạo catalog
                </Button>
            </div>
            {data && (
                <Table
                    data={data.catalogs}
                    attributesToShow={['name', 'slug']}
                    onEdit={onEditCatalog}
                    onDelete={onDeleteCatalog}
                />
            )}
            <ToastContainer theme='dark' />
        </div>
    );
}

export default Home;
