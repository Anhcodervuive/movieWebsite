import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast, ToastContainer } from 'react-toastify';
import classNames from 'classnames/bind';

import styles from './MoiveHome.module.css';

import Table from '@/components/admin/Table';
import Button from '@/components/UI/Button';
import config from '@/config';

import MovieService from '@/service/admin/movie.service';
import CategoryService from '@/service/admin/category.service';
import RegionService from '@/service/admin/region.service';
import useGetAPIData from '@/hooks/useGetAPIData';
import Loading from '@/components/UI/Loading';
import { DefaultToast } from '@/components/UI/ToastMessage';
import { SelectBox } from '@/components/UI/Input';
import { useDebounce } from '@/hooks';

const cx = classNames.bind(styles);

function useQuery() {
    return new URLSearchParams(useLocation().state);
}

function MovieHome() {
    const query = useQuery();
    const navigator = useNavigate();
    const message = query.get('message');
    const type = query.get('type');
    const [filterForm, setFilterForm] = useState({
        status: null,
        type: null,
        categoryId: null,
        regionId: null,
    });
    const [searchValue, setSearhValue] = useState('');
    const searchValueDebounce = useDebounce(searchValue, 1500);
    const { data, isLoading, isError } = useGetAPIData(
        async () => {
            return await MovieService.getAll({
                ...filterForm,
                name: searchValueDebounce,
            });
        },
        null,
        [searchValueDebounce, filterForm]
    );
    const {
        data: categoryData,
        isLoading: isCategoryLoading,
        isError: isCategoryError,
    } = useGetAPIData(async () => await CategoryService.getAll(), null, []);

    const {
        data: regionData,
        isLoading: isRegionLoading,
        isError: isRegionError,
    } = useGetAPIData(async () => await RegionService.getAll(), null, []);

    const onEditactor = useCallback(
        (id) => {
            navigator(config.routes.admin.moive.edit(id));
        },
        [navigator]
    );

    const handleChangeFilterForm = (e) => {
        const { name, value } = e.target;

        setFilterForm({
            ...filterForm,
            [name]: value,
        });
    };

    const onDeleteActor = useCallback(async (id) => {
        const result = await MovieService.delete(id)
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
                <h2>Danh sách phim:</h2>
                <Button
                    success
                    leftIcon={<FontAwesomeIcon icon={faPlus} />}
                    to={config.routes.admin.moive.create}>
                    Thêm phim
                </Button>
            </div>
            <div className={cx('filter', 'row', 'no-gutters')}>
                <Button size='small' classNames={cx('filter-icon')}>
                    <FontAwesomeIcon icon={faFilter} />
                </Button>
                <div className={cx('form-control', 'c-2', '')}>
                    <SelectBox
                        name='status'
                        value={filterForm.status ?? ''}
                        options={[
                            {
                                label: 'Trạng thái',
                                value: '',
                            },
                            {
                                label: 'Sắp chiếu',
                                value: 'trailer',
                            },
                            {
                                label: 'Đang chiếu',
                                value: 'ongoing',
                            },
                            {
                                label: 'Chiếu xong',
                                value: 'completed',
                            },
                        ]}
                        onChange={(e) => handleChangeFilterForm(e)}
                    />
                </div>
                <div className={cx('form-control', 'c-2', '')}>
                    <SelectBox
                        name='type'
                        value={filterForm.type ?? ''}
                        options={[
                            {
                                label: 'Định dạng',
                                value: '',
                            },
                            {
                                label: 'Phim lẻ',
                                value: 'single',
                            },
                            {
                                label: 'Phim bộ',
                                value: 'series',
                            },
                        ]}
                        onChange={(e) => handleChangeFilterForm(e)}
                    />
                </div>
                {!isCategoryLoading && !isCategoryError && (
                    <div className={cx('form-control', 'c-2', '')}>
                        <SelectBox
                            name='categoryId'
                            value={filterForm.categoryId ?? ''}
                            options={[
                                {
                                    label: 'Thể loại',
                                    value: '',
                                },
                                ...categoryData?.categories.map((value) => ({
                                    label: value.name,
                                    value: value.id,
                                })),
                            ]}
                            onChange={(e) => handleChangeFilterForm(e)}
                        />
                    </div>
                )}
                {!isRegionLoading && !isRegionError && (
                    <div className={cx('form-control', 'c-2', '')}>
                        <SelectBox
                            name='regionId'
                            value={filterForm.regionId ?? ''}
                            options={[
                                {
                                    label: 'Quốc gia',
                                    value: '',
                                },
                                ...regionData?.regions.map((value) => ({
                                    label: value.name,
                                    value: value.id,
                                })),
                            ]}
                            onChange={(e) => handleChangeFilterForm(e)}
                        />
                    </div>
                )}
            </div>
            {data && (
                <Table
                    data={data.movies}
                    attributesToShow={[
                        'name',
                        'thumb_url',
                        'type',
                        'status',
                        'publish_year',
                    ]}
                    onEdit={onEditactor}
                    onDelete={onDeleteActor}
                    initSearchValue={searchValue}
                    onSearch={setSearhValue}
                />
            )}
            <ToastContainer theme='dark' />
        </div>
    );
}

export default MovieHome;
